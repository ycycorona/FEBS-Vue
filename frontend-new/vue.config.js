const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },

  chainWebpack: (config) => {
    // 移除 prefetch 插件
    // config.plugins.delete('prefetch')

    config.resolve.alias
      .set('@', resolve('src'))
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('~', resolve('src/components'))
      .set('utils', resolve('src/utils'))
    // 打包体积分析
    if (process.env.IS_ANALYZE) {
      config.plugin('webpack-report')
        .use(BundleAnalyzerPlugin, [{
          analyzerMode: 'static',
        }]);
    }
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': 'rgb(24, 144, 255)'
          /* less 变量覆盖，用于自定义 ant design 主题 */

          /*
          'primary-color': 'rgb(24, 144, 255)',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8001,
    proxy: {
      '^/api': {
        // target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
        // target: 'http://127.0.0.1:9527',
        target: 'http://39.106.162.152:9527',
        pathRewrite: {
          '^/api': ''
        },
        ws: false,
        changeOrigin: true
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}
