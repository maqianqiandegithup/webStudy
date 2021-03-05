import myDialog from './myDialog'

myDialog.install = function(Vue){
    Vue.component(myDialog.name,myDialog)
}

export default myDialog