## 最原始的命令直接用webpack来打包
#### 1.webpack的安装
webpack一般是本地安装，也就是在自己所需要的项目中进行安装，需要安装的包有两个
-webpack webpack-cli -D
-D表示安装的是依赖，在项目上线的时候不需要加载
**注**：项目初始化的时候，可以直接使用命令：

```
cnpm init -y
```

 他与之前使用的`cnpm init ` 的区别是会默认进行一系列的设置，而不需要自己在一步步的回车，方便了项目的开发。
#### 2.webpack的0配置
webpack是一个打包工具，打包之后输出（默认打包js文件，成一个）
打包需要一个打包目录，比如src文件。
webpack的打包命令`$    webpack`
webpack可以进行0配置，但是这个配置就比较弱小。
#### 3.手动配置webpack
默认文件为webpack.config.js
可以通过一个html静态文件，让webpack打包后的结果显示在前端页面上。

```
<body>
    <script src = "bundle.js"></script>
</body>
```
## 插件
背景：一般情况下，我们需要通过一个ip地址，或者是通过localhost的方式来访问一个页面，这种情况下，我们需要进行设置。
**解决办法**：使用webpack-dev-server
安装完webpack-dev-server 后，可以直接运行npx webpack-dev-server，会生成一个地址。
webpack-dev-server 直接把文件写在内存中
#### 1.不做任何设置
如果不做任何设置，直接在项目目录下运行npx webpack-dev-server，打开默认的地址，会进入当前项目的目录，但我们希望能够直接进入项目的html这个静态文件，所以需要设置
#### 2.如何设置webpack-dev-server
设置webpack-dev-server，其实就是设置开发服务器，可以做webpack.config.js
中的module.export中的devServer中进行设置，具体设置如下所示

```
module.exports = {
    devServer:{//这里开发服务器的配置
        port:3000,//设置端口号
        progress:true,//打包的时候可以加一个滚动条
        contentBase:'./dist',//设置服务器默认打开的位置
        open:true,//设置为true，可以自动打开浏览器
    },
   ......
   }
   
```
#### 3.高级设置
在src下建一个index.html模板，如何让打包后的路径指向这个模板，我们可以看到这个情况。此时，需要一个插件
**注**：只是进行服务器的设置，但是如果要打包还得依靠webpack。
#### 4.如何打包html页面，将打包结果放到dist目录下
使用plugins插件设置，利用html-webpack-plugins方式进行设置，
（1）安装html-webpack-plugins插件在项目中
（2）在webpack.config.js中进行设置，如代码所示

```
    plugins:[
        new HtmlWebpackPlugin({
            template:"./src/index.html",//告诉模板的位置
            filename:"index.html"
        })
    ]
```
#### 5.项目使用webpack压缩
采用webpack命令之后，打包后的目录中会新出现index.html,现在要对这个html文件进行压缩，需要用minify进行设置

```
minify:{
                removeAttributeQuotes:true,//删除双引号,会智能识别，不该删掉的双引号不会删掉。
                collapseWhitespace:true,将所有代码文件生成一行

            },
            hash:true  //打包时添加hash
```

**注**：加入希望每次打包生成的包不一样，可以给打成的包的文件名中加入时间戳，防止覆盖

```
output:{
        filename:'bundle.[hash:8].js',//打包后的文件名，加入时间戳，使得每一次生成的项目都不一样,8限制生成的时间戳的位数。
        path:path.resolve(__dirname,'dist'),//路径必须是绝对路径,改语法的作用是在当前目录下解析出一个dist目录来
    }
```



## 样式处理
1.



## 插件
1.HtmlWebpackPlugin
2.miniCSSExtractplugin
3.extract-text-webpack-plugin
把样式抽离成一个单独的文件，采用link标签引入
4.自动添加前缀，需要aotuprefxie和postcss配合
5.OptimizeCSSPlugin 优化css文件和体积
6.UglifyJS Webpack Plugin:插件用来缩小（压缩优化）js文件
7.CopyWebpackPlugin 批量复制某个文件夹下的文件，这个文件会被完整的复制到这个文件下
8.'clean-webpack-plugin .每次打包文件的时候都能清空原有的打包文件
9.BannerPlugin('make 2019 by jw')//会插到打包后的文件的js开头，表明版权
10.webpack-merge：
## loader
css-loader
处理css文件
less-loader
postcss-loader 自动添加前缀
eslint-loader 语法校验loader
expose-loader 暴露全局的loader
file-loader 【1.在js中创建图片来引入】
 file-loader默认会在内部生成一张图片到build目录下，把生成的图片的名字返回来
 url-loader：base64转化

## 如何压缩和优化资源
1.css

## es6语法转换【处理js模块，使用babel】
2.安装babel-loader和@babel/core,,@babel/core,@babel?preset-env
babel/polyfill

## 语法校验模块
使用eslint-loader的时候，还可以去官网下载一些配置文件

## 全局引入变量
## 打包文件分类
    1.各自到各自的模块
    2.公共前缀
## resolve

## 定义环境变量

## noparse
