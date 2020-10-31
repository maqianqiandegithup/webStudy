class Vue {
    constructor(opts) {
        this._data = opts.data
        this.opts = opts
        this.compile(opts.el)
    }
    compile(el) {
        let node = document.querySelector(el)
        this.compileNode(node)
    }
    compileNode(node) {
        let nodeList = node.childNodes
        console.log(nodeList)
        nodeList.forEach(ele => {
            if(ele.nodeType == 1){
                ele.childNodes.length > 0 && this.compileNode(ele)
            }else if (ele.nodeType == 3) {
                let reg = /\{\{\s*([^\{\}]+)\s*\}\}/g
                let textContent = ele.textContent
                if (reg.test(textContent)) {
                    let $1 = RegExp.$1
                    ele.textContent = ele.textContent.replace(reg, this._data[$1])
                }
            }
        });
    }
observe(data){
        Object.defineProperty({},"message",{
            configurable:true,
            enumerable:true,
            get(){
                console.log("get>>>")
            },
            set(newVal){
                console.log(newVal)
            }
        } )
    }
}

