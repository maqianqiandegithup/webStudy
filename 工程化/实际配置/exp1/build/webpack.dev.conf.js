'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge') //这个插件用来合并两个配置
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
    //这个插件用来合并两个配置
const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    //   开发服务器的配置
    devServer: {
        // mock数据的时候用
        before(app) {
            // 在这里直接写匹配路由
        },
        // clientLogLevel: 'warning',
        // historyApiFallback: {
        //     rewrites: [
        //         { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
        //     ],
        // },
        // 
        // 启用热更新
        hot: true,
        // contentBase: false, // since we use CopyWebpackPlugin.
        // compress: true,
        // host: HOST || config.dev.host,
        // port: PORT || config.dev.port,
        // 是否自动打开浏览器
        // open: config.dev.autoOpenBrowser,
        // overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
        // publicPath: config.dev.assetsPublicPath,
        // proxy: config.dev.proxyTable,
        // quiet: true, // necessary for FriendlyErrorsPlugin
        // // watch打包监控的选项
        // watch: true, //实时打包
        // watchOptions: {
        //     poll: config.dev.poll, //每秒访问多少次，
        //     aggregatement: 500, //防抖 500毫秒内输入的东西只打包1次
        //     ignored: /node_modules/, //不需要进行监控的配置
        // }
    },
    plugins: [
        // 定义环境变量
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // 打印更新的模块插件
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        // 把index.html作为注入模板,有了它，打包后的js或者css才会自动注入到html里面。
        new HtmlWebpackPlugin({
            // 在这里可以选择压缩html模板体积
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            minify: {
                removeAttributeQuotes: true, //删除双引号,会智能识别，不该删掉的双引号不会删掉。
                collapseWhitespace: true, //将所有代码文件生成一行
            },
            hash: true //打包时添加hash
        }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.dev.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
                // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors ?
                    utils.createNotifierCallback() : undefined
            }))

            resolve(devWebpackConfig)
        }
    })
})