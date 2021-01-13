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

/**
 * 疑问1：
 * Animal.bind 如果直接.bind更改原型方法，改的不是原型链上的
 * 疑问2：
 * instanceof（）
 */