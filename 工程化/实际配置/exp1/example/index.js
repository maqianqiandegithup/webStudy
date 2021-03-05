let button = document.createElement('button')
button.innerHTML = 'heoolo'
button.addEventListener('click', function() {
    // es6草案中的语法，jsonp实现动态加载文件,返回一个promise
    import ('./source.js').then(data => {
        console.log(data.default)
    })
})

document.body.appendChild(button)