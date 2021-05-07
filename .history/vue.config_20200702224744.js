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
  }
}
