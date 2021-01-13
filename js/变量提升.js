function mqq() {
    if (true) {
        a = 2
    }
}
// ======================================
// 案例1
console.log(a); //ReferenceError: a is not defined
if (true) {
    a = 10;
    console.log(a); //10
}
console.log(a); //10
// 上面的代码类似于


// 案例2
var company = "yideng"; // 变量声明并赋值
function company() {
    console.log("yideng");
}
console.log(typeof company); // string

// 上边的代码等价于
var company;

function company() {};
company = 'yideng'; // 被重新赋值
console.log(typeof company); // 所以是string

//案例4
console.log(a); // 这里不报错，是undefined
if (true) {
    console.log(a); // function a
    function a() {};
}

// 上边的代码等价于
var a; // 函数a的声明
console.log(a); // undefined
if (true) {
    function a() {} // 函数a的定义
    console.log(a); // function a
}
//
alert(a);
a();
var a = 3;

function a() {
    alert(10);
}
alert(a);
a = 6;
a();

/**var a
 * function a() {
    alert(10);
}   
     alert(a); f
     a(); 10
     a = 3 
    alert(a);3
    a = 6;
    a();
 */