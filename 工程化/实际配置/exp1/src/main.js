// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/common.styl'
import './assets/fonts/icon-fonts/iconfont.css'

// 引入自定义的dialog组件
import myCompoent from '@/components/common/custom/myCompoent'
import store from './vuex'
// 公共js方法
import publicJs from '../static/publicJs/publicJs'
// 接口文件
import api from '@/http/api';
Vue.prototype.$api = api;
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(publicJs)
Vue.use(myCompoent)
    /* eslint-disable no-new */
var a = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
console.log(a)