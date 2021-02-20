var GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin({
  versionCommand: 'describe --always --tags --dirty'
});
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
      plugins: [
        new webpack.DefinePlugin({
          'VERSION': JSON.stringify(gitRevisionPlugin.version()),
          'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
          'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
        }),
      ],
    },
}
