function throttle(fn, wait) {
    let previce = 0
    return function() {
        let now = +new Date()
        let context = this
        let args = [].slice.call(arguments)
        if (now - previce > wait) {
            fn.apply(context, args);
            previce = now
        }
    }
}