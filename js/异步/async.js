async function e() {
    return Promise.resolve(1)
}
async function e() {
    return await 1
}

const timeoutFn = function(timeout) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, timeout)
    })
}

async function fn() {
    await timeoutFn(1000)
    await timeoutFn(2000)
    return '完成'
}


function timeout(time) {
    return new Promise(function(resolve) {
        return setTimeout(function() {
            return resolve(time + 200)
        }, time)
    })
}

function first(time) {
    console.log('第一次延迟了' + time)
    return timeout(time)
}

new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    }, 1000)
})

function ajax(Url) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest()
        req.open('Get', URL, true)
        req.onload = function() {
            if (req.status === 200) {
                resolve(req.responseText)
            } else {
                reject(new Error(req.statusText))
            }
        }
        req.onerror = function() {
            reject(new Error(req.statusText))
        }
        req.send()
    })
}
ajax(URL).then((value) => {
    document.write('内容是' + value)
})




var p1 = new Promise((resolve, reject) => {
    resolve(1)
})
var p2 = new Promise((resolve, reject) => {
    resolve(p1)
})
p2.then(res => {
    console.log(res)
}).then(res => {
    console.log(res)
})

async function f2() {
    await 1
}

//test start...
//testSomething 
// undefined
//testAsync
//undefied
//test end
//promise START...
//promise RESOLVE
===
===
===
= en


function testSometing() {
    console.log("testSomething");
    return "return testSomething";
}

async function testAsync() {
    console.log("testAsync");
    return Promise.resolve("hello async");
}

async function test() {
    console.log("test start...");

    const testFn1 = await testSometing();
    console.log(testFn1);

    const testFn2 = await testAsync();
    console.log(testFn2);

    console.log('test end...');
}

test();

var promiseFn = new Promise((resolve) => {
    console.log("promise START...");
    resolve("promise RESOLVE");
});
promiseFn.then((val) => console.log(val));

console.log("===END===")


test start...
testSomething
promise START... ===
    END ===
    return testSomething
testAsync
promise RESOLVE
hello async
test end...

test start...
testSomething
promise START... ===
    END ===
    return testSomething
testAsync
promise RESOLV
hello async
test end...





test start...
testSomething
promise START... ===
    END ===
    promise RESOLVE
return testSomething
testAsync
hello async
test end...
1: aa, bb
宏任务： settime(0)
微任务1,
1.1, 2, 3, 4, 5, 6
1: aa, bb
宏任务：
微任务 5, 6
1.2, 3, 4

宏任务： settime,
微任务: 7, 6,
    1, 2, 3, 4, 5, 7, 6, 8

宏任务： settime,
微任务: 6, 8, 7,
    1, 2, 3, 4, 5, 6, 8, 7;
宏任务： 9
微任务: await的结果,
    1, 2, 3, 4, 5, 6, 7, await的结果, 8

微任务: , 2
1,
test start, promise, 'await 1', promise in async, 1, await 2, 2, 3, 4,