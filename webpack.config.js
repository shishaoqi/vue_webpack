const path = require('path')

//高版本必加项
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractPlugin = require('extract-text-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const config = {
    //使生成的bundle.js不被压缩
    mode: 'none',

    //入口， __dirname 是当前文件所在目录
    entry: path.join(__dirname, 'src/index.js'),

    //区分打包类库代码 -- 失败
    optimization: {
        splitChunks: {
            chunks: 'initial'
        }
    },

    //输出
    output: {
        filename: 'bundle.[hash:8].js',
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
                test: /\.jsx$/,
                loader: 'babel-loader'
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
    //开发环境 styl 的配置
    config.module.rules.push({
        test: /\.styl/,
        use: [
            'style-loader',
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
}else{
    //在webpack4中删除了原来的CommonsChunkPlugin插件,内部集成的optimization.splitChunks选项可以直接进行代码分离.
    

    //生产环境 css、js文件单独打包
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push(
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
        },
    )
    config.plugins.push(
        //new ExtractPlugin('styles.[contentHash:8].css')
        new ExtractPlugin('styles.[md5:contenthash:hex:8].css'),
    )
}

//加入webpack-dev-server后改变的
module.exports = config;