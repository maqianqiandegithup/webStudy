// 一、基本数据类型：undefined，null，number，boolean，string，symbol
//二、typeof进行判断
typeof undefined === 'undefined'
typeof undeclared === 'undefined'
typeof true === 'boolean'
typeof 22 === 'number'
typeof NaN === 'number'
typeof '22' === 'string'
typeof [] === 'object'
typeof {} === 'object'
typeof null === 'object'
typeof /regex/ === 'object'
typeof new Date() === 'object'
typeof new String() === 'object'

typeof new Function() === 'function'
typeof

function a() {} === 'function'

// 2. instanceof
object instanceof constructor

22 instanceof Number => false '22'
instanceof String => false[] instanceof Object => true {}
instanceof Object => true
undefined instanceof Object => false
null instanceof Object => false
null instanceof null => Uncaught TypeError: Right - hand side of 'instanceof'
is not an object

new String('22') instanceof String => true
new Number(22) instanceof Number => true
    // 3.Objec.prototype.toString.call()
Object.prototype.toString.call(22) => "[object Number]"
Object.prototype.toString.call('22') => "[object String]"
Object.prototype.toString.call({}) => "[object Object]"
Object.prototype.toString.call([]) => "[object Array]"
Object.prototype.toString.call(true) => "[object Boolean]"
Object.prototype.toString.call(Math) => "[object Math]"
Object.prototype.toString.call(new Date) => "[object Date]"
Object.prototype.toString.call(Symbol(22)) => "[object Symbol]"
Object.prototype.toString.call(() => {}) => "[object Function]"
Object.prototype.toString.call(null) => "[object Null]"
Object.prototype.toString.call(undefined) => "[object Undefined]"