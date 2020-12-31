//实现负数索引
const negativeArray = els =>
    new Proxy(els, {
        get: (target, key, receive) => Reflect.get(target, +key < 0 ? String(target.length + +key) : key, receive)
    })
let arr = [1, 2, 4]

let newArr = negativeArray(arr)

//实现a===1&&a===2&&a===3

let value = 1,
    a = {}
b = new Proxy(a, {
    get: (target, key, receive) => value++
})

function fun1() {
    var a = 1
    return function() {
        let b = a
    }
}

var data = [{
        name: 'AAA',
        child: [
            { name: 'a1', child: [{ name: 'a1-1' }, { name: 'a1-2' }] },
            { name: 'a2' },
            { name: 'a3', child: [{ name: 'a3-1' }, { name: 'a3-2', child: [{ name: 'a3-2-1' }, { name: 'a3-2-2' }] }] }
        ]
    },
    {
        name: 'BBB',
        child: [{ name: 'b1' }, { name: 'b2' }, { name: 'b3' }]
    },
    {
        name: 'CCC',
        child: [{ name: 'c1' }, { name: 'c2' }, { name: 'c3' }]
    }
];
// div class = 'lists' > < /div>
function render(data) {
    `<p>AAA</p>${result}`
    let innerHtml = ''
    data.forEach(ele => {

    });
}

`<p>AAA</p>${result}`

function render(data) {
    let result = ''
    data.forEach(ele => {
        if (ele.child) {
            result = result + `<li><p>${ele.name}</p></li>` + render(ele.child)
        } else {
            result += `<li><p>${ele.name}</p></li>`
        }
    });

}