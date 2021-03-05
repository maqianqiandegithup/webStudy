import myQmark from './myQmark'

myQmark.install = function(Vue) {
    Vue.component(myQmark.name, myQmark)
}

export default myQmark