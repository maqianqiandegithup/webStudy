// 实现function原型的bind方法，是的以下程序输出“success”
function Animal(name, color) {
    this.name = name;
    this.color = color;
}
Animal.prototype.say = function() {
    return `I'm a ${this.color}${this.name}`;
}
const Cat = Animal.bind(null, 'cat');
const cat = new Cat('white');
if (cat.say() === "I'm white cat" && cat instanceof Cat && cat instanceof Animal) {
    console.log('sunccess');
}

// 1.重写Function.prototype.bind()
// 2.bind函数柯里化，返回一个函数
//3.函数继承：cat实例化自Cat，cat继承自原型继承animal也就是Cat的原型指向new animal
Function.prototype.bind = function(_this, arg) {
    const name = arg
    const callFn = this

    function fn(color) {
        console.log(this)
        callFn.call(this, name, color)
    }
    fn.prototype = Object.create(callFn.prototype)
    fn.prototype.say = function() {
        return `I'm a ${this.color}${this.name}`;
    }
    return fn
}