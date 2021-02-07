// 公众号对象
let eventEmitter = {};

// 缓存列表，存放 event 及 fn
eventEmitter.list = {};

// 订阅
eventEmitter.on = function(event, fn) {
    let _this = this;
    // 如果对象中没有对应的 event 值，也就是说明没有订阅过，就给 event 创建个缓存列表
    // 如有对象中有相应的 event 值，把 fn 添加到对应 event 的缓存列表里
    (_this.list[event] || (_this.list[event] = [])).push(fn);
    return _this;
};

// 发布
eventEmitter.emit = function() {
    let _this = this;
    console.log(1, this)
        // 第一个参数是对应的 event 值，直接用数组的 shift 方法取出
    let event = [].shift.call(arguments),
        fns = [..._this.list[event]];
    // 如果缓存列表里没有 fn 就返回 false
    if (!fns || fns.length === 0) {
        return false;
    }
    // 遍历 event 值对应的缓存列表，依次执行 fn
    fns.forEach(fn => {
        fn.apply(_this, arguments);
    });
    return _this;
};
// 取消订阅
eventEmitter.off = function(event, fn) {
    // 既有普通注册的函数需要删除，同时
    let _this = this,
        fns = eventEmitter.list[event]
    if (!fns || !fns.length) return false
    if (!fn) {
        // 如果只提供了事件，则移除该事件所有的监听器
        fns && (fns.length = 0)
    } else {
        fns.forEach((cb, index) => {
            if ((cb === fn) || (cb.fn === fn)) {
                fn.splice(index, 1)
                break
            }
        })
    }

}

[cb, cb, fn()]
// 我在on的时候，加进去的就是单个数组。但这里是什么意思，这是为了配合once，
eventEmitter.once = function(event, fn) {
    // once就是我我先调用一次，但是调用完我就把自己给删除了,函数封装函数
    let _this = this

    function on() {
        _this.off(event, )
        fn.apply(_this, arguments)
    }
    on.fn = fn
    _this.on(event, on)
    return _this
}

function user1(content) {
    console.log('用户1订阅了:', content);
    console.log(2, this)
};

function user2(content) {
    console.log('用户2订阅了:', content);
};

// 订阅
eventEmitter.on('article', user1);
eventEmitter.on('article', user2);

// 发布
eventEmitter.emit('article', 'Javascript 发布-订阅模式');

/*
    用户1订阅了: Javascript 发布-订阅模式
    用户2订阅了: Javascript 发布-订阅模式
*/

//全文中所有的this都指向eventEmitter