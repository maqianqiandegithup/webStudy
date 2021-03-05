let fs = require('fs')
let path = require('path')
let babylon = require('babylon')
let t = require('@babel/types')
let tranverse = require('@babel/traverse').default
let generator = require('@babel/generator').default
    // babylon 主要就是把源码转换成ast
    // @babel-traverse
class Compiler {
    constructor(config) {
        //entry output
        this.config = config;
        //需要保存入口文件的路径
        this.entryId; //'./src/index.js'
        //需要保存所有的模块依赖
        this.modules = {}
        this.entry = config.entry; //入口路径
        // 运行npm的工作路径
        this.root = process.cwd()
    }
    getSource(modulePath) {
            let content = fs.readFileSync(modulePath, 'utf-8')
            return content
        }
        // 解析源码
    parse(source, parentPath) { //AST解析语法树
            let ast = babylon.parse(source)
            console.log(source, parentPath)
            tranverse(ast, {
                CallExpression(p) {
                    let node = p.node
                    if (node.callee.name === 'require') {
                        node.callee.name = '_webpack_rquire_'
                        let moduleName = node.arguments[0].value //取到的就是模块的引用名字
                        moduleName = moduleName + (path.extname(moduleName) ? '' : '.js')
                        moduleName = './' + path.join(parentPath, moduleName)
                        node.arguments = [t.stringLiteral(moduleName)]
                    }
                }
            })
            let sourceCode = generator(ast).code
            return { sourceCode, dependencies }
        }
        // 构建模块
    buildModule(modulePath, isEntry) {
        // 拿到模块的内容
        let source = fs.getSource(modulePath)
            // 模块id modulePath(相对路径) = modulePath-this.root  src/index.js
        let moduleName = './' + path.relative(this.root, modulePath)
        if (isEntry) {
            this.entryId = moduleName //保存入口的名字
        }
        // 解析需要把source远吗进行改造，返回一个依赖列表
        let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName)) //取得父目录，./src
            // 把相对路劲和模块中的内容对应起来
        this.modules[moduleName] = sourceCode
    }
    emitFile() {

    }
    run() {
        //执行，并且创建模块的依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true)

        // 发射一个文件 打包后的文件
        this.emitFile()
    }
}

module.exports = Compiler