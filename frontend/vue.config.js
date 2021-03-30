const webpack = require('webpack');

module.exports = {
    lintOnSave: false,
    publicPath: '',

    pluginOptions: {
      cordovaPath: 'src-cordova'
    },
    devServer:{
      disableHostCheck: true
    },
    configureWebpack: {
      plugins: [],
    },
}
