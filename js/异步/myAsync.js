const myAsync = (gen) => {
    return new Promise((resolve, reject) => {
        var g = gen

        function step(val) {
            try {
                var res = g.next(val)
            } catch (e) {

            }
            if (res.done) return res.value
            else {
                Promise.resolve(res.value).then(val => step(val)).catch(e => g.throw(e))
            }
        }
    })
}