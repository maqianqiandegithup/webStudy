var myaply = function(contenx, ...args) {
    if (typeof this != 'function') {
        throw new TypeError('not function')
    }
    const contenx
    let result
    contenx = contenx || window
    contenx.fn = this
    args = args && args[0] || []
    result = contenx.fn(...args)
    delete contenx.fn
    return result
}