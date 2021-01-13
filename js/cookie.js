function setCookie(name, value) {
    var day = 30
    var exp = new Date()
    exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`
}

// 设置cookie
function getCookie() {
    var arr, reg = new RegExp(`(^|)${name}=([^;]*)(;|$)`)
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2])
    } else {
        return null
    }
}

function delCookie(name) {
    var exp = new Date()
    exp.setTime(exp, getTime() - 1)
    var cval = getCookie(name)
    if (cval != null) {
        document.cookie =
    }
}
// 删除cookie
function delCookie2(name) {
    var exp = new Date();
    exp.setTime(exp.getTime()– 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
    }
}