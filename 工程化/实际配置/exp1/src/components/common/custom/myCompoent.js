let importAll = require.context('@/components/common/custom', true, /\.js$/)

const myComponents = []

importAll.keys().map(path => {
    // 因为 myCompoent.js 也在 @/publicResource/router 目录下，所以需要排除
    if (!path.includes('./myCompoent.js')) {
        //兼容处理：.default 获取 ES6 规范暴露的内容; 后者获取 commonJS 规范暴露的内容
        myComponents.push(importAll(path).default || importAll(path))

    }
})
console.log(myComponents)

function install(Vue) {
    myComponents.forEach(component => Vue.use(component))
}

export default { install }