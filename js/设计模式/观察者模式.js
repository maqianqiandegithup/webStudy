//发布者和订阅者也是一对多的关系
// 但是发布者必须清楚订阅者的内部方法和结构，依赖于订阅者
//一个对象对应多个对应，这里的observer可以是多个，但是一定得是有update这个方法c\
class Publisher {
    constructor() {
        this.subs = []
    }
    addSubs(sub) {
        // 必须要求要有update方法
        sub && sub.update && this.subs.push(sub)
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update() //可以在这里传递参数
        })
    }
}
class watcher {
    constructor() {

    }
    update() {
        console.log('被通知了')
    }
}

let watch1 = new watcher()
let watch2 = new watcher()
const publish1 = new Publisher()
publish1.addSubs(watch1)
publish1.addSubs(watch2)
publish1.notify()