import myButton from './myButton'

myButton.install = function(Vue) {
    Vue.component(myButton.name, myButton)
}

export default myButton