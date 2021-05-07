/*
 * @Descripttion: 
 * @Author: zxy
 * @Date: 2020-07-02 22:47:45
 * @LastEditTime: 2020-11-11 16:34:33
 */
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/chartsBI-web' 
  : './',
  devServer: {
    proxy: 'http://localhost:8080'
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}
