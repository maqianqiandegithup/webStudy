function idmaker() {
    var index = 0;
    return {
        next: function () {
            return { value: index++, done: false }
        }
    }
}
function arrayIrator(array) {
    var index = 0
    return {
        next: function () {
            return index < array.length ?
                { value: array[index++], done: false } :
                { value: undefined, done: true }
        }
    }
}
// for of自动调用Iterator，但是next需要实现调用
class RangeItarator{
    constructor(start,end){
        this.value = start
        this.end = end
    }
    [Symbol.iterator](){return this}
    next(){
        var value = this.value
        if(value < this.end){
            return {value:value++,done:false}
        }else{
            return {value:undefined,done:true}
        }
    }
}
function range(start,end){
    return new RangeItarator(start,end)
}

for (var value of range(0,3)){
    console.log(value)
}