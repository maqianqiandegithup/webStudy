class Observer{
    constructor(label){
        this.label = label
    }
    update(){
        console.log(`update${this.label}`)
    }
}
class Target{
    constructor(){
        this.ObserverList = []
    }
    add(observer){
        this.ObserverList.push(observer)
    }
    remove(observer){
        this.ObserverList = this.ObserverList.filter(ob=> ob !== observer)
    }
    notify(){
        this.ObserverList.forEach(ob=>{
            ob.update()
        })
    }
}
let tar = new Target()
for(let i=0; i<10;i++){
    tar.add(new Observer(i))
}
tar.notify()