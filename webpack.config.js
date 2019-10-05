const path = require('path')

//高版本必加项
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

const config = {
  //入口， __dirname 是当前文件所在目录
  entry: path.join(__dirname, 'src/index.js'),
  //输出
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  plugins: [
      // make sure to include the plugin for the magic
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: isDev ? '"development"' : '"production"'
          }
      }),
      new HTMLPlugin()
    ],
  module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.styl/,
                use: [
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },
            //将小于1024d的图片转为base64，减少http请求
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name]-image.[ext]'
                        }
                    }
                ]
            }
        ]
    }
}

// 由于加入webpack-dev-server，要应对不同环境变量
if(isDev){
    //让浏览器显示正常代码
    config.devtool = "#cheap-module-eval-source-map",

    
    config.devServer = {
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
    //针对 hot: true 加入的
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}

//加入webpack-dev-server后改变的
module.exports = config;