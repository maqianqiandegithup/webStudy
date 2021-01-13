class Person {
    constructor(name, age, gender) {
        this.name = name;
        this.age = age;
        this.gender = gender
    }
    static mmq = 2
    run() {
        console.log(this.name + ' can run fast !')
    }
}
let lilin = new Person('lilin', 25, 'women');
let lc = new Person('lc', 25, 'men');
console.log(lilin, lc);
lilin.run();