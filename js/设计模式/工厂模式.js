//一般用的就可以看作是工厂模式
function MyObject(name) {
    this.name = name
    this.mqq = ''
}
MyObject.prototype.mqq = function() {}
var a = new MyObject('name')


function MyObject2(name) {
    let obj = new Object()
    obj.name = name
    return obj
}