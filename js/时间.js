var arr = new Array(100000).fill(null)
console.time('arr1');
arr[0]
console.timeEnd('arr1')

var arr = new Array(100000).fill(null)
console.time('arr100000');
arr[99999]
console.timeEnd('arr100000')