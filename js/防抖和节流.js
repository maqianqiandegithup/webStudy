//防抖，停止点击n秒后触发
function debounce(fn, wait) {
    let timeId
    return function() {
        let context = this
        let args = [].slice.call(arguments);
        clearTimeout(timeId)
        timeId = setTimeout(() => {
            fn.apply(context, args)
        }, wait);
    }
}
//防抖立即执行版
function debounceIme(fn, wait, immediate) {
    let timer = null
    return function() {
        let args = [].slice.call(arguments)
        let context = this
        clearTimeout(timer)
        if (immediate) {
            let doNow = !immediate
            timer = setTimeout(() => {
                timer = null
            }, timeout);
            if (doNow) fn.apply(context, args)
        } else {
            timer = setTimeout(() => {
                fn.apply(context, args)
            }, wait);
        }
    }
}