var person = function() {
    var fullName = 'coolb'
    var reg = new RegExp(/\d+/)
    return {
        setName: function(val) {
            if (reg.test(val)) {
                console.log('invalid')
            } else {
                fullName = val
            }
        },
        getfullName: function() {
            return fullName
        }
    }
}

var p = person()

var o = new Object()
o._proto_ = Foo.prototype
Foo.call(o)