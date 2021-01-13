const mergePromise = (ajaxArray) => {
    return (async function() {
        let arr = []
        let i = 0
        for (i; i < ajaxArray.length; i++) {
            arr.push(await ajaxArray[i]())
        }
        return arr
    })()
}

mergePromise([ajax1, ajax2, ajax3]).then(data => {
    console.log('done')
    console.log(data)
})