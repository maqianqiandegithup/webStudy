//双等于会触发类型转换，所以会调用valueOf方法
class A {
    constructor(value) {
        this.value = value
    }
    valueOf() {
        return this.value++
    }
}

a = new A(1)
a == 1 && a == 2 && a == 3

//全等于使用proxy时间代理