function* foo() {
    var y = 2 * (yield(x + 1))
    var z = yield(y / 3)
    return (x + y + z)
}
for (let n of foo(5)) {
    console.log(n)
}

function* fibnq() {
    let [pre, cur] = [0, 1]
    for (;;) {
        [pre, cur] = [cur, pre + cur]
        yield cur
    }
}

for (let n of fibnq()) {
    if (n > 1000) break
    console.log(n)
}

let a = 1,
    b = 2;
[a, b] = [b, a]