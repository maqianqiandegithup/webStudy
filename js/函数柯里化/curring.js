//函数参数长度固定 
function curring(fn, length) {
    length = length || fn.length
    return function() {
        var args = [].slice.call(arguments)
        if (args.length < length) {
            return curring(fn.bind(this, ...args), length - args.length)
        } else {
            return fn.call(this, ...args)
        }
    }
}

function adds(a, b, c) {
    return a + b + c
}

//函数参数长度不固定
//函数参数长度不固定

1.1704