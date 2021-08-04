function* gen() {
    yield "hello";
    yield "wordl";
}
// generate 函数返回一个遍历器对象，也就是具有
// Symbol.iterator 属性，并且返回给自己

var g = gen()
g.next()  //{value: "hello", done: false}
g.next()        //{value: "wordl", done: false}
g.next()  //{value: undefined, done: true}

// 通过调用next方法可以带一个参数，这参数会被当做上一个yild表达式的返回值
function* foo(x) {
    var y = 2*(yield (x + 1))
    var z = yield(y/3)
    return (x + y + z)
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }

