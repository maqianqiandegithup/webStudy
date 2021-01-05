function mySetInterval(fn, a, b) {
    console.log(1, arguments)
    this.time = 0
    this.timeout = null
    this.start = () => {
        this.timeout = setTimeout(() => {
            console.log(2, arguments)
            fn()
            this.start()
            this.time++
        }, a + this.time * b);
    }
    this.stop = () => {
        clearTimeout(this.timeout)
        this.timeout = null
        this.time = 0
    }
}

function add(a) {
    console.log(a)
}
var m = new mySetInterval(add, 2000, 3000)
m.start()