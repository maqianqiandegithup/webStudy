function singleInstance() {
    this.name = 1

    if (!singleInstance.instance) {
        this.instance = new singleInstance()
    }
    return this.instance
}

//用闭包实现
var singleton = (function() {
    var singClass = function() {
        this.name = 'name'
    }
    var instance
    return function() {
        !instance && (instance = new singClass())
        return instance
    }
})()