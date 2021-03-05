export default {
    install: function(Vue) {

        // 添加实例方法
        Vue.prototype.$changeDate = function(date) {
            if (!date) return 0
            let arr = date.split('-')
            return `${arr[0]}年${arr[1]}月${arr[2]}日`
        }
        Vue.prototype.$downLoadFiles = function(url) {
            if (!document.getElementById("iframe")) {
                var iframe = document.createElement("iframe");
                document.body.appendChild(iframe);
                iframe.style.display = "none";
                iframe.id = "iframe";
            }
            document.getElementById("iframe").src = url;
            let times = null;
            if (times) clearTimeout(times);
            times = setTimeout(() => { document.getElementById("iframe").parentNode.removeChild(document.getElementById("iframe")); }, 1e4)
        };

        //防抖函数，简单版
        Vue.prototype.$debounce = function(func, wait, isImediate) {
            let timeout
            return function() {
                const context = this
                const args = arguments
                clearTimeout(timeout)
                if (isImediate) {
                    // 立即执行版
                    let doNow = !timeout
                    timeout = setTimeout(() => { timeout = null }, wait);
                    doNow && func.apply(context, args);
                } else {
                    //非立即执行版
                    timeout = setTimeout(() => { func.apply(context, args); }, wait);
                }

            }
        }

        //以时间戳的方式实现节流
        Vue.prototype.$throttleByStamp = function(func, wait, isStamp) {
                let previce = 0
                return function() {
                    let now = +new Date()
                    let context = this
                    let args = [].slice.call(arguments)
                    if (now - previce > wait) {
                        func.apply(context, args);
                        previce = now
                    }
                }
            }
            //以定时器的方式实现节流
        Vue.prototype.$throttleByTimer = function(func, wait, isStamp) {
                let timeout = null
                return function() {
                    let context = this
                    let args = [].slice.call(arguments)
                    if (!timeout) {
                        timeout = setTimeout(() => {
                            timeout = null
                            func.apply(context, args);
                        }, wait)
                    }
                }
            }
            // rgba转换成16进制
        Vue.prototype.$hexify = function(func, wait) {
            letvalues = color
                .replace(/rgba?\(/, '')
                .replace(/\)/, '')
                .replace(/[\s+]/g, '')
                .split(',');
            let a = parseFloat(values[3] || 1),
                r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
                g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
                b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
            return "#" +
                ("0" + r.toString(16)).slice(-2) +
                ("0" + g.toString(16)).slice(-2) +
                ("0" + b.toString(16)).slice(-2);
        }

        // 求组求和
        Vue.prototype.$arraySum = function(arr) {
                let s = 0;
                arr.forEach(function(val, idx, arr) {
                    // console.log(val)
                    s += parseFloat(val);
                }, 0);

                return s;
            },
            Vue.prototype.$ceshiUrl = "http://172.16.5.37:8930/",
            Vue.prototype.$zhengshiUrl = "http://111.202.125.138:8080/image/"
    }
}