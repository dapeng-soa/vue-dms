module.exports = {
  lintOnSave: undefined,
  devServer: {
    // 设置代理
    proxy: {
      '/': {
        target: 'http://127.0.0.1:9000', // 域名
        ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理
        pathRequiresRewrite: {
          '^/': '/'
        }
      }
    }
  }
};
