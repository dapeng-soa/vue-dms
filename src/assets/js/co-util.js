import { Message, MessageBox } from 'element-ui'

// 通过字体图标导入
const fontIcons = {
  success: 'icon-hin_suc1 icon-success',
  error: 'icon-hin_error_-px icon-error',
  warning: 'icon-hin_warn_-px icon-warning',
  info: 'icon-hin_px icon-info',
  confirm: 'icon-hin_px icon-confirm'
}

/**
 * Created by Jarek on 2018/11/08.
 */
export default {
  /**
   * message消息提示
   * @param obj 只支持传输 字符串 和 对象
   * @param obj {message: '', type: 'success'(消息类型)}
   */
  message: (obj) => {
    if (!(obj && (typeof obj === 'string' || Object.prototype.toString.call(obj) ===
      '[object Object]'))) {
      throw Error('请传入正确的参数')
    }
    if (typeof obj === 'string') {
      obj = {
        message: obj
      }
    }
    const message = obj.message || ''
    const icon = obj.type ? fontIcons[obj.type] : fontIcons['info']
    Message({
      showClose: true,
      dangerouslyUseHTMLString: true,
      message: `<i class="iconfont ${icon}"></i><p>${message}</p>`,
      duration: 1500,
      center: true
    })
  },
  /**
   * confirm消息提示
   * @param obj 只支持传输 字符串 和 对象
   */
  confirm: (obj, callback, event, cancel) => {
    if (!(obj && (typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object Object]'))) throw Error('请传入正确的参数')
    if (typeof obj === 'string') {
      obj = { message: obj }
    }
    const message = obj.message || ''
    const icon = obj.type ? fontIcons[obj.type] : fontIcons['confirm']
    const content = `<i class="iconfont ${icon}"></i><p>${message}</p>`
    // todo 需要对不同的 type 提供不同的 icon
    MessageBox.confirm(content, '', {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      dangerouslyUseHTMLString: true,
      type: 'warning',
      center: true,
      beforeClose: (action, instance, done) => {
        done()
        if (action === 'confirm') {
          callback && callback(event)
        } else {
          cancel && cancel()
        }
      }
    })
      .then(() => {
      })
      .catch(() => {
      })
  },
  /**
   * 删除请求条件中属性值为空的属性
   */
  dealNullQueryCondition (obj) {
    for (var p in obj) {
      if (obj[p] === '' || (obj[p] !== 0 && obj[p] !== false && !obj[p] &&
        (typeof obj[p] !== 'boolean' || typeof obj[p] !== 'number'))) {
        delete obj[p]
      }
    }
  },
  /**
   * 判断是否为空
   */
  isNull (obj) {
    if (obj === '' || (obj !== 0 && obj !== false && !obj &&
      (typeof obj !== 'boolean' || typeof obj !== 'number'))) {
      return false
    }
    return true
  },

  uuid (len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    let uuid = [],
      i
    radix = radix || chars.length
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
      let r
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    const data = uuid.join('')
    return { data }
  }
}
