//1.预检查请求
a = copy(form.semispace）)
if（ to.semispace》 25 % ）{
    a => 老生代 //以防影响后续的新对象分配
}
else {
    a => to.semispace
}
第二次垃圾回收
if (Obj.isHasGC) {
    copy(obj) => 老生代
}
var a = new obj
if (a.size > 1 MB) {
    a => 老生代（ largeObjectSpace）

} else {
    a => 新生代
}
三、 新生代的GC机制与优缺点
let from to old
while (true) {
    for (let i in from) {
        isUse(i) && (to.semispace < 25 % ? to.push(...isUse) : old.push(...isUse))
    }
    from = []
    from = [...to]
    to = []
}
四、 老生代的GC机制与优点
old
mark - sweep
while (true) {
    for (let i in old) {
        isUse(i) ? i.lable = true : delete i
    }
}