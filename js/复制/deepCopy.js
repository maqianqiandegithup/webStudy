function deepClone(obj) {
    var result = typeof obj.splice === 'function' ? [] : {},
        key;
    if (obj && typeof obj === 'object') {
        for (key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                result[key] = deepClone(obj[key]); //如果对象的属性值为object的时候，递归调用deepClone，即再把某个值对象复制一份到新的对象的对应值中
            } else {
                result[key] = obj[key]; //如果对象的属性值不为object的时候，直接复制参数对象的每一个键/值到新对象对应的键/值中
            }
        }
        return result;
    }
    return obj;
}
// 拷贝对象，有个弊端，会把原型链的给直接复制到一级上 ,也没有考虑属性名会是symbol的状态
function deepClone(data) {
    const t = typeOf(data)
    let o
    if (t === 'array') {
        o = []
    } else if (t === 'object') {
        o = {}
    } else {
        return data
    }
    if (t === 'array') {
        data.forEach(ele => {
            o.push(deepClone(ele))
        });
    } else {
        for (let i in data) {
            o[i] = deepClone(data[i])
        }
    }
    return o
}

function typeOf(obj) {
    let type = Object.prototype.toString.call(obj)
    let reg = /\[object\s+(\w+)\]/
    return type.match(reg)[1].toLocaleLowerCase()
}