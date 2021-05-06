/*
 * @Descripttion: 
 * @Author: zxy
 * @Date: 2020-07-02 22:47:45
 * @LastEditTime: 2020-11-11 14:16:22
 */
module.exports = {
  publicPath: './',
  devServer: {
    proxy: 'http://localhost:8080'
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  build: {
    assetsPublicPath: './',
  }
}
