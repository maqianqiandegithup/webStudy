/* 
  1.从start至end,每隔100毫秒console.log一个数字，每次数字增幅为1
  2.返回的对象中需要包含一个cancel方法，用于停止定时操作
  3.第一个数字需要立即输出
*/
const timeout = (ms) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
const ajax1 = () =>
    timeout(2000).then(() => {
        console.log("1");
        return 1;
    });
const ajax2 = () =>
    timeout(1000).then(() => {
        console.log("2");
        return 2;
    });
const ajax3 = () =>
    timeout(2000).then(() => {
        console.log("3");
        return 3;
    });
const mergePromise = (ajaxArray) => {
    // 1,2,3 done [1,2,3] 此处写代码 请写出ES6、ES3 2中解法
};
mergePromise([ajax1, ajax2, ajax3]).then((data) => {
    console.log("done");
    console.log(data); // data 为[1,2,3]
});
// 执行结果为：1 2 3 done [1,2,3]