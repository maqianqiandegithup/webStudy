// 在不改变对象自身的基础上， 在程序运行期间给对象动态地添加一些额外职责
//给对象动态的添加某些行为
//装饰者不改变对象自身。
class Draw {
    constructor(circle) {
        this.circle = circle
    }
    draw() {
        console.log('画图')
    }
}
class Deprator {
    constructor(circle) {
        this.circle = circle
    }
    draw() {
        this.circle.draw()
        this.setBorder()
    }
    setBorder() {
        console.log('加上边框')
    }
}

let circle = new Draw('1')
let deprate = new Deprator(circle)
    // es5
function sanjiao(san) {
    this.san = san
}
sanjiao.prototype.draw = function() {
    console.log('draw')
}

function Dep(san) {
    this.san = san
}
Dep.prototype.draw = function() {
    this.san.draw()
    this.setDep()
}
Dep.prototype.setDep = function() {
    console.log(5)
}