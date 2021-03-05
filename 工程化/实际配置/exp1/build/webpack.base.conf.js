'use strict'
// 在这里写基础公用的属性
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
    // 把css样式单独

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre', //强制loader，在下一个loader之前执行，或“post”
    include: [resolve('src'), resolve('test')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})

module.exports = {
    // 优化项
    optimization: {
        // 用来压缩的
        minimizer: [
            new OptimizeCss(),
            new UglifyJsPlugin()
        ],
        // 分割代码块
        splitChunks: { //分割代码块
            cacheGroups: { //缓存组
                common: { //公共模块
                    chunks: 'initial',
                    minSize: 0, //被引用的字节超过0
                    minChunks: 2, //被引用的次数超过10次
                },
                vendor: {
                    priority: 1, //先抽离第三方模块，然后抽离上面的
                    test: /node_modules/,
                    chunks: 'initial',
                    minSize: 0, //被引用的字节超过0
                    minChunks: 2,
                }
            }
        }
    },
    mode: 'development', //配置模式
    // 源码映射，会单独生成一个映射文件，会指出有bug的源文件的行和列，大而全
    devtool: 'source-map',
    //2)不会产生单独的文件，但是可是显示行和列
    //devtool:'eval-source-map',
    //3)不会产生列，但是是一个单独的映射文件
    //devtool:'cheap-module-source-map',//产生后可以保留下来，用来后面的调试
    //4)不会产生文件，集成在打包后的文件中 不会产生列
    // devtool: 'cheap-module-eval-source-map',
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js',
        // 在这里可以配置多页
        other: './src/other.js'
    },
    output: {
        /** 
         *         这个路径必须是绝对路径
         */
        path: config.build.assetsRoot,
        filename: '[name].js',
        //[name],这里的name代表home，other
        // filename: 'dis.[hash:8].js',
        // 给所有的url加一个统一的前缀
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    // 解析第三方包的配置
    resolve: {
        extensions: ['.js', '.vue', '.json'], //先找js，然后找vue，然后找json找文件扩展的顺序，这个可以自己配，所以可以不用显示的写后缀
        alias: { // 别名
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'styles': resolve('src/assets/styles'),
            'assets': resolve('src/assets'),
        },
        mainFields: [],
        mainFiles: [], //入口文件的名字,index.js
        modules: [path.resolve('node_modules')] //只在当前目录下的node_modules查找

    },
    module: {
        noParse: /jquery/, //不去解析jquery中的依赖库
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: { //用babel-loader需要把es6转换成es5,
                    presets: [
                        '@babel/preset-env'
                    ]
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, //做一个限制，如果图片小于多少k，全部变成base64，否则用file-loader产生真实的图片。
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                // css-loader专门解析 @import这种语法
                // stylus-loader专门把css插入到head标签
                // loader的功能就是单一
                // 多个loader需要[]
                // loader的顺序是默认从右往左,从下到上执行
                // opitons里面是参数
                test: /\.(css)(\?.*)?$/,
                loader: 'css-loader',
                // use: 'css-loader',
                // use: ['css-loader'],
                options: {
                    insertAt: 'top'
                }
            },
            {
                // css-loader专门解析 @import这种语法
                // stylus-loader专门把css插入到head标签
                // loader的功能就是单一
                // 多个loader需要[]
                // loader的顺序是默认从右往左,从下到上执行
                // opitons里面是参数
                // 3. less - loader（ 把less文件解析成css， 实现需要安装less）
                // miniCssExtractPlugin 把css抽离成一个单独的样式
                test: /\.(less)(\?.*)?$/,
                use: [miniCssExtractPlugin, {
                    loader: 'style-loader',
                    options: {
                        insertAt: 'top'
                    }
                }, 'css-loader', 'less-loader']

            }
        ]
    },
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}