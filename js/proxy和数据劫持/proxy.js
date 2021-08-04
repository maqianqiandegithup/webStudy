function createArray(...array) {
    let handler = {
        get(target, propKey, receiver) {
            let index = Number(propKey)
            if (index < 0) {
                propKey = String(target.length + index)
            }
            return Reflect.get(target, propKey, receiver)
        }
    }
    let target = [...array]
    return new Proxy(target,handler)
}

let arr = createArray(1,2,4)


// 实现链式操作
var pipe = function(value){
    var funStack = []
    var oproxy = new Proxy({},{
        get:function (propKey,fnName) {
            if(fnName === 'get'){
                return funStack.reduce(function (val,fn) {
                    return fn(val)
                },value)
            }
            funStack.push(window[fnName])
            return oproxy
        }
    })

    return oproxy
}

// 下面的例子则是利用get拦截，实现一个生成各种 DOM 节点的通用函数dom

const dom = new Proxy({},{
    get(target,proprty){
        return function (attrs={},...children) {
            const el = document.createElement(proprty)
            for(let prop of Object.keys(attrs)){
                el.setAttribute(prop,attrs[prop])
            }
            for(let child of children){
                if (typeof child === 'string'){
                    child = document.createTextNode(child )
                }
                el.appendChild(child)
            }
            return el
        }
    }
})

const el = dom.div({},
    'Hello, my name is ',
  dom.a({href: '//example.com'}, 'Mark'),
  '. I like:',
  dom.ul({},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it')
  )
    )

    document.body.appendChild(el);


    // 下面是一个get方法的第三个参数的例子，它总是指向原始的读操作所在的那个对象，一般情况下就是 Proxy 实例。
    
    const proxy = new Proxy({},{
        get(target,prop,receiver){
            return receiver
        }
    })

    let validator = {
        set(obj,prop,value){
            if(prop === 'age'){
                if(!Number.isInteger(value)){
                    throw new TypeError('The age is not an intenger')
                }
                if(value > 200){
                    throw new RangeError('The age seems invalid')
                }
            }

            obj[prop] = value
            return true
        }
    }

    let person = new Proxy({},validator)

    person.age = 100
    person.age
    person.age = 'young'
    person.age = 300

    // 有时，我们会在对象上面设置内部属性，属性名的第一个字符使用下划线开头，表示这些属性不应该被外部使用。结合get和set方法，就可以做到防止这些内部属性被外部读写

    const handler = {
        get(target,key){
            invariant(key,'get')
            return targe[key]
        },
        set(target,key,value){
            invariant(key,'set')
            target[key] = value
            return true
        }
    }

    function invariant(key,action) {
        if(key[0] === '_'){
            throw new Error('Invalid attempt')
        }
    }



    // call方法的使用
    // 如果两个都不能抓住，那起码要抓住一个
    // apply（）
    var target = function () {
        return 'I am the target'
    }
    var hadler = {
        apply:function () {
            return "T am the proxy"
        }
    }
    var p=new Proxy(target,handler)


    // has
    var handler = {
        has(target,key){
            if(key[0] === '_'){
                return false
            }
            return key in target
        }
    }

    var target = {_prop:'foo',prop:'foo'}
    var proxy = new Proxy(target,handler)

    '_prop' in proxy

    var obj = {a:10}
    Object.preventExtensions(obj)
    var p=new Proxy(obj,{
        has:function (target,prop) {
            return false
        }
    })

    'a' in p

    // cnsturct

    const p=new Proxy(function (){
        
    },{construct:function (target,args) {
        console.log('called' + arguments.join(', '))
        return {value:arg[0] * 10}
    }})

    (new p(1)).value

    const hanlder = {
        construct(target,args){
            console.log(this === handler)
            return new target(...args)
        }
    }

    // deleteProperty()

var handler = {
    deleteProperty(target,key){
        invariant(key,'delete')
        delete target[key]
        return true
    }
}
function invariant (key, action) {
    if (key[0] === '_') {
      throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
  }

  var target = {_prop:'foo'}
  var proxy = new Proxy(target,handler)
  delete proxy._prop

//   getOwnPropertyDescriptor()
var handler = {
    getOwnPropertyDescription(){
        if(key[0]=== '_'){
            return
        }
        return Object.getOwnPropertyDescriptor(target,key)
    }
}

var target = {_foo:'bar',baz:'tar'}
var proxy = new Proxy(target,handler)
Object.getOwnPropertyDescriptor(proxy,'wat')
Object.getOwnPropertyDescriptor(proxy,'_foo')
Object.getOwnPropertyDescriptor(proxy,'baz')

getPrototypeOf() 
var proto={
}
var p=new Proxy({},{
    getPrototypeOf(target){
        return proto
    }
})

isExtensible()

var p=new Proxy({},{
    isExtensible:function(target) {
        console.log('called')
        return true
    }
})
Object.isExtensible(p)


// ownKeys()
let target = {
    a:1,
    b:2,
    c:3
}
let hanlder = {
    ownKeys(target){
        return ['a']
    }
}

let proxy = new Proxy(target,handler)
Object.keys(proxy)

let target = {
    _bar:'foo',
    _prop:'bar',
    prop:'baz'
}
let hanlder ={
    ownKeys(target){
        return Reflect.ownKeys(target).filter(key=>key[0]!=='_')
    }
}

let proxy = new Proxy(target,hanlder)
for(let key of Object.keys(proxy)){
    console.log(target[key])
}

// proxy的this指向
const _name = new WeakMap()
class Person{
    constructor(name){
        _name.set(this,name)
    }
    get name(){
        return _name.get(this)
    }
}

const jane = new Person('Jane')
jane.name

const proxy = new Proxy(jane,{})
proxy.name

const target = new Date('2015-01-01')
const handler = {
    get(target,prop){
        if(prop === 'getDate'){
            return target.getDate.bind(target)
        }
        return Reflect.get(target,prop)
    }
}

const proxy = new Proxy(target,handler)
proxy.getDate()