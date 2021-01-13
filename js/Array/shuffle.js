var arr = [1, 2, 3, 4]

function disorder() {
    return Array.from(arr).sort(() => Math.random() - 0.5)
}
var arr = [1, 2, 3, 4, 5]

function disorder(arr) {
    return Array.from(arr).sort(() => Math.random() - 0.5)
}
var arr2 = disorder(arr)
console.log(arr2)
console.log(arr)
console.log(arr === arr2)

var numbers = [4, 2, 5, 1, 3];
numbers.sort(function(a, b) {
    return a - b;
});
console.log(numbers);
4 - 2 > 0[2, 4, 5, 1, 3]
4 - 5 < 0[2, 4, 5, 1, 3]
5 - 1 > 0[2, 4, 1, 5, 3]
5 - 3 > 0[2, 4, 1, 3, 5][2, 1, 4, 3, 5], [2, 1, 3, 4, 5][1, 2, 3, 4, 5]