<template>
  <div class="m-list c-container">
    <div class="c-header">
      <el-form :inline="true" class="demo-form-inline">
        <el-row type="flex" align="middle" justify="start">
          <el-col :span="8">
            <el-form-item label="服务名称" class="c-query-input">
              <el-input v-model="queryCondition.serviceName" placeholder="支持模糊搜索"
                        :disabled="!!searchId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接口名称" class="c-query-input">
              <el-input v-model="queryCondition.methodName" placeholder="请输入服务方法名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="c-query-input">
            <div class="f-right">
              <el-button type="primary" @click="searchForm('queryCondition')">搜索</el-button>
              <el-button class="c-button__default" @click="resetForm('queryCondition')">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="c-content">
      <div class="f-left">
        <div class="ey-tittle-level2 m25">MOCK接口列表</div>
      </div>
      <div class="f-right">
        <el-button type="primary" @click="addMethod">添加接口信息</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column align='center' label="ID" min-width="80" prop="id"></el-table-column>
        <el-table-column align='center' label="服务简称" min-width="100" prop="simpleService"></el-table-column>
        <el-table-column align='center' label="接口名称" min-width="100" prop="method"></el-table-column>
        <el-table-column align='center' label="请求类型" min-width="100" prop="requestType"></el-table-column>
        <el-table-column align='center' label="接口地址" min-width="150" prop="url" show-overflow-tooltip></el-table-column>
        <el-table-column align='center' label="规则数量" min-width="100" prop="mockSize" show-overflow-tooltip></el-table-column>
        <el-table-column align='center' label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="queryMockRule(scope.row.id)">查看Mock规则</el-button>
            <el-button type="text" size="small" @click="modifyMethod(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="deleteMethod(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="queryCondition.pageRequest.pageIndex"
                       :page-sizes="[5, 10, 20, 30, 40]"

                       :page-size="queryCondition.pageRequest.limit"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="queryCondition.pageRequest.results">
        </el-pagination>
      </div>
    </div>


    <!--添加弹出框 begin-->
    <el-dialog
      :title="methodForm.title"
      :visible.sync="createDialogVisible"
      width="40%"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="method-dialog">
      <el-form :inline="true" class="demo-form-inline" label-width="90px" label-position="right"
               :rules="rules" ref="methodForm" :model="methodForm">
        <el-row type="flex" align="middle" justify="start">
          <el-col :span="24">
            <el-form-item label="服务名称" class="dialog-form-item" prop="serviceName">
              <el-autocomplete class="inline-input" v-model.trim="methodForm.serviceName"
                               :fetch-suggestions="querySearch"
                               placeholder="请输入内容" @select="handleSelect" :disabled="methodForm.type==='modify'">
                <template slot-scope="{ item }">
                  <div class="name">{{ item }}</div>
                </template>
              </el-autocomplete>
              <!--<el-input v-model.trim="methodForm.simpleService" placeholder="请输入内容"></el-input>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle" justify="start">
          <el-col :span="24">
            <el-form-item label="接口名称" class="dialog-form-item" prop="method">
              <el-input v-model.trim="methodForm.method" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle" justify="start">
          <el-col :span="24">
            <el-form-item label="请求类型" class="dialog-form-item" prop="requestType">
              <el-select v-model="methodForm.requestType">
                <el-option v-for="item in record.typeList" :value="item.value" :label="item.label"
                           :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle" justify="start">
          <el-col :span="24">
            <el-form-item label="接口地址" class="dialog-form-item" prop="url">
              <el-input v-model.trim="methodForm.url" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveOrUpdate">保存</el-button>
      </span>
    </el-dialog>
    <!--添加弹出框 end -->
  </div>
</template>

<script>
  import * as crud from '../../api/api'
  import util from '../../assets/js/co-util'

  export default {
    name: 'm-list',
    data () {
      return {
        queryCondition: {
          serviceName: null,
          methodName: null,
          pageRequest: crud.getQueryCondition()
        },
        record: {
          typeList: [
            {
              value: 'GET',
              label: 'GET'
            },
            {
              value: 'POST',
              label: 'POST'
            }
          ]
        },
        tableData: [],
        dialogVisible: false,
        createDialogVisible: false,
        methodForm: {
          title: '',
          type: '',
          id: null,
          serviceName: '',
          method: '',
          requestType: '',
          url: ''

        },
        rules: {
          serviceName: [
            {
              required: true,
              message: '请输入服务名称',
              trigger: 'blur'
            }
          ],
          method: [
            {
              required: true,
              message: '请输入接口名称',
              trigger: 'blur'
            }
          ],
          requestType: [
            {
              required: true,
              message: '请选择请求类型',
              trigger: 'blur'
            }
          ],
          url: [
            {
              required: true,
              message: '请输入接口地址',
              trigger: 'blur'
            }
          ]
        },
        searchId: null,
        searchName: null,
        restaurants: []
      }
    },
    methods: {
      querySearch (queryString, cb) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.toLowerCase()
            .indexOf(queryString.toLowerCase()) > -1)
        }
      },
      handleSelect (item) {
        this.methodForm.serviceName = item
      },
      /**
       * 关闭dialog时清除已填的数据
       */
      beforeClose (done) {
        this.methodForm = {}
        // this.$refs.methodForm.clearValidate()
        // this.$refs.methodForm.resetFields()
        // console.log(this.methodForm)
        done()
      },
      //查询service信息
      getServiceNameList () {
        const id = this.searchId
        let request = { id }
        util.dealNullQueryCondition(request)
        crud.post({
          service: 'admin/listServicesName',
          dealException: true,
          data: request
        })
          .then(res => {
            const data = res.data
            if (data.status === 1) {
              this.restaurants = data.success
              if (id) {
                this.searchName = this.restaurants[0]
                this.queryCondition.serviceName = this.searchName
              } else {
                this.queryCondition.serviceName = null
              }
            }
          })
          .catch(error => {
            console.error('request admin/listServicesName error:', error)
            util.message({
              message: error,
              type: 'error'
            })
          })

      },
      // 查询
      getMethodList () {
        const serviceId = this.searchId
        let { serviceName, methodName, pageRequest } = this.queryCondition
        let request = {
          serviceId,
          serviceName,
          methodName,
          pageRequest
        }
        util.dealNullQueryCondition(request)
        console.log('getMethodList request:', request)
        crud
          .post({
            service: 'admin/listInterfaces',
            dealException: true,
            data: request
          })
          .then(res => {
            const data = res.data
            if (data.status === 1 && JSON.stringify(data.success.methodList) !== 'undefined') {
              this.tableData = data.success.methodList
              this.queryCondition.pageRequest = crud.getCurrentPage(
                data.success.pageResponse
              )
            }
          })
          .catch(error => {
            console.error('request admin/listInterfaces error:', error)
            util.message({
              message: error,
              type: 'error'
            })
          })
      },
      // 查看Mock规则
      queryMockRule (id) {
        this.$router.push({
          name: 'm-mock-rule',
          params: { id }
        })
      },
      // 查询按钮
      searchForm () {
        this.queryCondition.pageRequest = crud.getQueryCondition()
        this.getMethodList()
      },
      // 重置
      resetForm () {
        this.tableData = []
        this.queryCondition = {
          simpleName: null,
          methodName: null,
          pageRequest: crud.getQueryCondition()
        }
        this.searchId = null
        this.searchName = null
        this.searchForm()
      },
      /**
       * 增加或修改保存...
       */
      saveOrUpdate () {
        this.$refs['methodForm'].validate(valid => {
          if (valid) {
            let { serviceName, method, requestType, url, id } = this.methodForm
            let request = {
              serviceName: serviceName,
              methodName: method,
              requestType,
              url,
              id
            }
            util.dealNullQueryCondition(request)

            let service = this.methodForm.type === 'add' ? 'admin/createInterface' : 'admin/updateInterface'
            let message = this.methodForm.type === 'add' ? '新增接口成功' : '修改接口成功'
            crud
              .post({
                service,
                dealException: true,
                data: request
              })
              .then(res => {
                let { status, responseMsg } = res.data
                if (status === 1) {
                  util.message({
                    message,
                    type: 'success'
                  })
                  this.createDialogVisible = false
                  this.methodForm = {}
                  this.getMethodList()
                } else {
                  util.message({
                    message: responseMsg,
                    type: 'error'
                  })
                }
              })
              .catch(error => {
                console.error(message, error)
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 新增
      addMethod () {
        this.methodForm.title = '新增接口'
        this.methodForm.type = 'add'
        this.createDialogVisible = true
        // this.dialogVisible = true
        this.$nextTick(_ => {
          this.$refs['methodForm'].clearValidate()
        })
        if (this.searchId) {
          this.methodForm.serviceName = this.searchName
        }
      },
      // 修改
      modifyMethod (row) {
        this.methodForm = JSON.parse(JSON.stringify(row))
        this.methodForm.title = '修改接口'
        this.methodForm.type = 'modify'
        this.createDialogVisible = true
        this.$nextTick(_ => {
          this.$refs['methodForm'].clearValidate()
        })
      },
      handleSizeChange (limit) {
        this.queryCondition.pageRequest.limit = limit
        this.queryCondition.pageRequest = crud.getQueryCondition(
          this.queryCondition.pageRequest
        )
        this.getMethodList()
      },
      handleCurrentChange (pageIndex) {
        this.queryCondition.pageRequest.pageIndex = pageIndex
        this.queryCondition.pageRequest = crud.getQueryCondition(
          this.queryCondition.pageRequest
        )
        this.getMethodList()
      },
      // 删除接口
      deleteMethod (row) {
        util.confirm('是否删除该接口？', this.del, row.id)
      },
      // 删除接口二次确认
      del (id) {
        crud
          .post({
            service: 'admin/deleteInterface',
            dealException: true,
            data: { id }
          })
          .then(res => {
            let { status, responseMsg } = res.data
            if (status === 1) {
              util.message({
                message: '删除成功',
                type: 'success'
              })
              this.getMethodList()
            } else {
              util.message({
                message: responseMsg,
                type: 'error'
              })
            }
          })
          .catch(error => {
            console.error('request admin/deleteInterface error:', error)
          })
      }
    },
    activated () {
      this.searchId = this.$route.params.id
      this.getServiceNameList()
      this.getMethodList()
    }
  }
</script>

<style lang="scss">
  .m-list {
    .f-left {
      float: left;
      .table-title-text {
        height: 40px;
        line-height: 40px;
        font-size: 20px;
      }
    }
    .f-right {
      float: right;
    }
    .method-dialog {
      .el-row {
        margin-bottom: 20px;
        .dialog-form-item {
          width: 100%;
          .el-form-item__content {
            width: calc(100% - 90px);
            .el-autocomplete,
            .el-date-editor.el-input,
            .el-select {
              width: 100%;
            }
          }
        }
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
</style>
