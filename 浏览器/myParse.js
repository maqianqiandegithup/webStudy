function parse(str) {
    return new Function('return' + str)()
}

function parse(jsonStr) {
    return new Function('return' + jsonStr)();
}
var jsonStr = '{"age":20,"name":"jack"}';
parse(jsonStr);