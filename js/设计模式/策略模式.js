//定义:实现一系列的算法，把他们一个个封装起来，并且可以互相替换
// 策略类
//环境类context:context接受客户请求，随后委托给策略类
const strategies = {
    isEmpty: (value, errorMsg) => {
        if (value = '') {
            return errorMsg
        }
    },
    minLength: (value, errorMsg) => {
        if (value.length < 6) {
            return errorMsg
        }
    },
    isMobile: (value, errorMsg) => {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
}

class Validator {
    constructor() {
        this.cache = []
    }
    add(dom, strategy, errorMsg) {
        this.cache.push(() => {
            const args = [dom.value, errorMsg]
            return strategies[strategy].apply(dom, value)
        })
    }
    start() {
        this.forEach(fn => {
            const msg = fn()
            if (msg) return msg
        });
    }
}

//使用
const registerForm = document.getElementById('registerForm')
const validator = new Validator()
validator.add(registerForm.userName, "isNonEmpty", "用户名长度不能为空")
validator.add(registerForm.password, "minLength", "密码长度不能少于6位");
validator.add(registerForm.phone, "isMobile", "手机号码格式不正确");

function validateFunc() {
    const error = validator.start();
}
registerForm.onsubmit = () => {
    const errorMsg = valiedateFunc()
    if (error) {
        alert(errorMsg)
        return false
    }
}