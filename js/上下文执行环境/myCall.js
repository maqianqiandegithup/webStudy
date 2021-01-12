var myCall = function(context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('no error')
    }
    let context = context || window
    let result = null
    context.fn = this
    result = context.fn(...args)
    delete context.fn
    return result

}

function staticMAge() {
    a = 1
}