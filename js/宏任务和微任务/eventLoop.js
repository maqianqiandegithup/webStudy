console.log("start");
setTimeout(() => {
    console.log("children2");
    Promise.resolve().then(() => {
        console.log("children3");
    });
}, 0);
new Promise(function(resolve, reject) {
    console.log("children4");
    setTimeout(function() {
        console.log("children5");
        resolve("children6");
    }, 0);
    // 这里是什么原理呢，这里的then其实要是属于children6这个宏任务的微任务
}).then((res) => {
    console.log("children7");
    setTimeout(() => {
        console.log(res);
    }, 0);
});
//宏任务 script脚本 children2 setTimeout
// settimeout交给定时器线程，等时间到了再放到定时器队列
//微任务
// 输出：start，children4 children2 children3 children5 children7 children6

console.log("start");
setTimeout(() => {
    console.log("children2");
    Promise.resolve().then(() => {
        console.log("children3");
    });
}, 2000);
new Promise(function(resolve, reject) {
    console.log("children4");
    setTimeout(function() {
        console.log("children5");
        resolve("children6");
    }, 1000);
    // 这里是什么原理呢，这里的then其实要是属于children6这个宏任务的微任务
}).then((res) => {
    console.log("children7");
    setTimeout(() => {
        console.log(res);
    }, 0);
});
//宏任务 ,1000
// 定时器线程2000，1000
//微任务：
// 输出：start，children4，children5，children7，children6，children2，children3
//对于每一种宏任务，都有一个对应的处理线程，来决定把他们放到队列里面