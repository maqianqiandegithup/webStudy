Array.prototype.myReduce = function(fn, initValue) {
    if (fn.length == 0) {
        if (initValue === undefined) {
            console.error('reduce of empty width no initValue')
        } else {
            return initValue
        }
    } else {
        let prev = initValue === undefined ? this[0] : initValue
        let startIndex = initValue === undefined ? 1 : 0
        for (let i = startIndex; i < this.length; i++) {
            prev = fn(prev, this[i])
        }
        return prev
    }
}