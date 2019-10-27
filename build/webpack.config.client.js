const path = require('path')

const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base');

const isDev = process.env.NODE_ENV === 'development';

const defaultPlugins = [
  new webpack.DefinePlugin({
      'process.env': {
          NODE_ENV: isDev ? '"development"' : '"production"'
      }
  }),
  new HTMLPlugin()
]

const devServer = {
  port: 8080,
  host: '0.0.0.0',
  overlay: {
      errors: true,
  },
  //open: true
  //把webpack不能解释的地址指向到首页
  //historyFallback: {}
  //
  hot: true
}

let config

// 由于加入webpack-dev-server，要应对不同环境变量
if(isDev){
  config = merge(baseConfig, {
    output: {
      //filename: '[name].[chunkhash:8].js', //生产环境 css、js文件单独打包
      filename: isDev ? '[name].[hash:8].js' : '[name].[chunkHash:8].js', //生产环境 css、js文件单独打包
      path: path.join(__dirname, '../dist')
    },
    //让浏览器显示正常代码
    devtool: "#cheap-module-eval-source-map",
    module: {
      //开发环境 styl 的配置
      rules: [
        {
          test: /\.styl/,
          use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                }
              },
              'stylus-loader'
            ]
          })
        }
      ]
    },
    devServer,
    plugins: defaultPlugins.concat([
      new ExtractPlugin('styles.[md5:contenthash:hex:8].css'),
      new webpack.HotModuleReplacementPlugin()//针对 hot: true 加入的
    ])
  })
}else{
  config = merge(baseConfig, {
    output: {
      //filename: '[name].[chunkhash:8].js', //生产环境 css、js文件单独打包
      filename: isDev ? '[name].[hash:8].js' : '[name].[chunkHash:8].js', //生产环境 css、js文件单独打包
      path: path.join(__dirname, '../dist')
    },
    module: {
      rules: [
        {
          test: /\.styl/,
          use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                }
              },
              'stylus-loader'
            ]
          })
        }
      ]
    },
    plugins: defaultPlugins.concat([
      //new ExtractPlugin('styles.[contentHash:8].css')
      new ExtractPlugin('styles.[md5:contenthash:hex:8].css')
    ])
  })
}

//加入webpack-dev-server后改变的
module.exports = config;