const path = require('path')

//高版本必加项
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {
    //使生成的bundle.js不被压缩
    mode: 'none',

    //入口， __dirname 是当前文件所在目录
    entry: path.join(__dirname, '../client/index.js'),

    //输出
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, '../dist')
    },

    //区分打包类库代码
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: true
    },

    plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
              test: /\.vue$/,
              loader: 'vue-loader'
            },
            {
              test: /\.jsx$/,
              loader: 'babel-loader'
            },
            {
              test: /\.js$/,
              loader: 'babel-loader',
              exclude: /node_modules/
            },
            //将小于1024d的图片转为base64，减少http请求
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: 'resources/[path][name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    }
}


module.exports = config;