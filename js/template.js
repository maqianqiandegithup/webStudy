var str = "您好，<%=name%>。欢迎来到<%=location%>";
// 方法1
function template(str) {
    function fn(obj) {
        let reg, res = str
        for (a in obj) {
            if (obj.hasOwnProperty(a)) {
                reg = new RegExp(`<%=(${a})%>`)
                res = res.replace(reg, obj[a])
            }
        }
        return res
    }
    return fn
}
var compiled = template(srt);
// compiled的输出值为：“您好，张三。欢迎来到网易游戏”
compiled({ name: "张三", location: "网易游戏" });
// 1. 正则表达式匹配
// 2.柯里化返回函数 3.

var str = "您好，<%=name%>。欢迎来到<%=location%>";


function template(str) {
    return data => str.replace(/<%=(\w+)%>/g, (match, p) => data[p] || '')
}
var compiled = template(str);
// compiled的输出值为：“您好，张三。欢迎来到网易游戏” 
compiled({
    name: "张三",
    location: "网易游戏"
});

return data => str.replace(/<%=(\w+)%>/g, (match, p) => data[p] || '')