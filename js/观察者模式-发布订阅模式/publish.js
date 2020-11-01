class Publisher{
    constructor(){
        this.subscribers = {}
        this.cache = {}
    }
    add(type,fn){
        if(Object.prototype.toString.call(fn) !== '[object Function]') return
        this.subscribers[type] ? this.subscribers[type].push(fn):this.subscribers[type] = [fn]
        return this
    }
    publish(type,theme){
        this.cache[type]? this.cache[type].push(theme):this.cache[type]=theme 
        let subscriber = this.subscribers[type]
        if(!subscribe || !subscribe.length){
            console.warn("no subsrcibe")
            return this
        }
        subscribe.forEach(fn => {
            fn.call(this,theme)
        });
        return this
    }
    unbind(type,fn){
        this.subscribers[type] = this.subscribers.filter(item=>item!==fn)
    }
    history(){
        let cache = this.cache[type]||[]
        cache.forEach(item=>fn.call(this,item))
        return this
    }
}
let sub1 = data=>[
    console.log(`sub${data}`)
]
let sub2 = data=>[
    console.log(`sub${data}`)
]
let sub3 = data=>[
    console.log(`sub${data}`)
]
let publisher = new Publisher()
publisher.add('click',sub1).add('click',sub2).add('change',sub3)

publisher.publish('click','第一次click').publish('change','第一次change')
publisher.unbind('click',sub1).publish('click','第二次点击').history('click',data=>{
    console.log('histiry'+data)
})