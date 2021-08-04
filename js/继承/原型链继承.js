function Parent(name,sex) {
    this.name = name
    this.play = [1,2,3]
}
Parent.prototype.getName = function () {
    return this.name
}
// 原型式继承
function child(name,sex) {
    this.name = name
}
child.prototype = new Parent("mqk","男")

// 构造函数继承【使用call】

function child(name,sex) {  
    Parent.call(this)
    this.name = name
}

// 组合式继承
function child(name,sex) {  
    Parent.call(this)
    this.name = name
}
child.prototype = new Parent()
child.prototype.constructor = child

// 原型式继承

let parent4 = {
    name:"mqq",
    firend:["lucky"]
}
let child4 = Object.create(parent4)

// 寄生式继承,封装原型式继承，并且增强了一些方法
function  clone(parent) {
    let child = Object.create(parent)
    child.getName = function (params) {
        
    }
    return child
}
let parent1 = clone(parent4)

// 寄生组合式继承【联合组合式继承】

function Parent6() {
    this.name = "Tom"
    this.age = 15
}
Parent6.prototype.getName = function () {
    return this.name
}
function clone(parent,child) {
    child.prototype = Object.create(parent.prototype)
    child.prototype.constructor = child
}
function child6(params) {
    Parent6.call(this)
    this.age = 26
}
child6.prototype.getAge = function () {
    return this.age
}
