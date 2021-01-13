function Person(name) {

    Person.sleep = function(time) {
        console.log(`等待${time}秒`)
        var timeId = setTimeout(() => {
            console.log(`wakeup after ${time}`)
        }, time);
        clearTimeout(timeId)
        return this
    }
    Person.eat = function(foods) {
        console.log(`eat${foods}`)
        return this
    }
    Person.sleepFirst = function(time) {
        console.log(`等待${time}秒`)
        var timeId = setTimeout(() => {
            console.log(`wakeup after ${time}`)
        }, time);
        clearTimeout(timeId)
        return this
    }
    Person.outName = function(name) {
        console.log(`Hi!this is ${name}`)
        return this
    }
}
class PersonGenerator {
    taskQueue = [];
    constructor(name) {
        this.taskQueue.push(() => this.sayHi(name));
        this.runTaskQueue();
    }
    nextTask = () => {
        if (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift();
            if (typeof task === "function") {
                task();
                this.nextTask();
            }
            if (typeof task === "number") {
                console.log(`Sleep ${task} seconds \n`);
                setTimeout(() => this.nextTask(), task * 1000);
            }
        }
    };

    runTaskQueue = () => {
        setTimeout(() => this.nextTask());
    };

    sayHi(name) {
        console.log(`Hi! This is ${name}! \n`);
        return this;
    }

    sleep(seconds) {
        this.taskQueue.push(seconds);
        return this;
    }

    sleepFirst(seconds) {
        this.taskQueue.splice(-1, 0, seconds);
        return this;
    }

    eat(food) {
        this.taskQueue.push(() => console.log(`Eat ${food}~ \n`));
        return this;
    }
}

const Person = name => new PersonGenerator(name);

Person("helloWorld").sleepFirst(3).sleep(3).eat("little_cute");