//代理模式是一个对象不能直接访问另一个对象，需要一个第三者代理从而间接达到访问目的。
var myImage = (function() {
    var imgNode = document.createElement('img')
    document.body.appendChild(imgNode)

    return {
        setImgSrc: function(src) {
            imgNode.src = src
        }
    }
})()

var myImage = (function() {
    var image = new Image()
    image.onload = function() {
        myImage.setImgSrc(this.src)
    }
    return {
        setImgSrc: function(src) {
            myImage.setImgSrc()
            image.src = src
        }
    }
})

//缓存代理，缓存计算结果
function mult() {
    let a = 1
    for (let i = 0; i < arguments.length; i++) {
        a = a * arguments[i]
    }
    return a
}

var proxyCalculate = (function() {
    var cache = {}
    return function() {
        let args = Object.prototype.join.call(arguments, ',')
        if (args in cache) return cache[args]
        return cache[args] = mult.apply(this, arguments)
    }
})()