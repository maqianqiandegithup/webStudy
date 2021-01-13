function suppeClass() {
    this.superObj = {}
}
suppeClass.prototype.superMethond = function() {}

function subClass() {

}
subClass.prototype = new suppeClass()
subClass.prototype = {}
subClass.prototype._proto_ = suppeClass.prototype
    // suppeClass.call(subClass.prototype)
subClass.prototype.superObj = {}
var sub = new subClass()
sub = {}
sub._proto_ = subClass.prototype

//寄生组合式继承
function inheritObject(o) {
    function F() {}
    p.prototype = o
    return new F()
}

function inheritPrototype() {

}

function mqq() {
    this.a = 2
}

function inheritObject(o) {
    function F() {}
    F.prototype = o
    return new F()
}

function inheriProptypetype(sub, super2) {
    var p = inheritObject(super2.prototype)
    p.constructor = sub
    subClass.prototype = p
}

function A1() {
    this.a = 1
}
A1.prototype.aa = 2

function B2() {
    B2.call(this)
}
B2.prototype = new A1()