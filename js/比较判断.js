布尔和所有比 = 》数字
数字和字符： 字符 = 》数字
对象和原始： toPromitive先valueof， 然后stringOf
对象比较存储地址
// if([]==0)
1. Boolean(Number([]) == 0)
2. Boolean(0 == 0)

// [1,2]=="1,2"
1. 1 == "1" && 2 == "2"
2. true && true

// if([])
1. Boolean([])
2. Boolean(true) // []是一个复杂类型存在地址引用，转化为Boolean值为true

// []==0
1. Number([]) == 0
2. 0 == 0
3. true

a = {
    b: 1,
    c: function(x) {
        console.log(this.b)
    }
}