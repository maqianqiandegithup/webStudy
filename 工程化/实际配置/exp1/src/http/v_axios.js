// 引入axios
import axios from "axios";

// 引入 vuex
// import store from "@/store.js";

// 引入router
import router from "../router/index.js";

// 全局提示
import { Message } from 'element-ui';


// 请求超时时间
axios.defaults.timeout = 15000;
axios.defaults.withCredentials = true;
axios.create.async = true;
axios.create.crossDomain = true;
axios.create.dataType = 'jsonp';


// 请求头
axios.defaults.headers['Content-Type'] = 'application/json;';
// axios.defaults.headers['Content-Type'] = "multipart/form-data"

// 请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    let tokens = sessionStorage.getItem("Token");
    if (tokens) {
        config.headers['Token'] = tokens;
        return config;
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 响应拦截器
axios.interceptors.response.use(function(response) {
    Message.closeAll();
    // 对响应数据做点什么
    // 采用本地一直缓存token的方式
    // let tokens = response.headers['token'];
    // sessionStorage.setItem("Token", tokens);
    if (response.data.code === 401) {;
        Message.warning(response.data.description);
    };
    return response;
}, function(error) {
    Message.closeAll();
    // 对响应错误做点什么
    const status = error.toString().split("code ")[1];
    if (status == 401) {
        Message.warning("您的登录信息已失效，请重新登录！");
        // 跳转登录页面
        router.replace({ path: "/" });
    } else if (status == 404) {
        Message.warning("网络连接错误！");
    } else if (status == 403) {
        Message.warning("您没有这个权限！");
    } else if (status == 9912) {
        Message.warning("您输入的账号或密码有误，请重新登录！");
    }
    return Promise.reject(error);
});


// get 请求
export function get(url, params) {
    let url_ = url.indexOf('?') == '-1' ? url + '?_=' + (new Date()).getTime() : url + '&_=' + (new Date()).getTime();
    return new Promise((resolve, reject) => {
        axios
            .get(url_, {
                params: params
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}
// post 请求
export function post(url, params) {
    let url_ = url.indexOf('?') == '-1' ? url + '?_=' + (new Date()).getTime() : url + '&_=' + (new Date()).getTime();
    return new Promise((resolve, reject) => {
        axios
            .post(url_, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}
// delete 请求
export function del(url, params) {
    let url_ = url.indexOf('?') == '-1' ? url + '?_=' + (new Date()).getTime() : url + '&_=' + (new Date()).getTime();
    return new Promise((resolve, reject) => {
        axios
            .delete(url_, {
                params: params
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}
// put 请求
export function put(url, params) {
    let url_ = url.indexOf('?') == '-1' ? url + '?_=' + (new Date()).getTime() : url + '&_=' + (new Date()).getTime();
    return new Promise((resolve, reject) => {
        axios
            .put(url_, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}