// let data = Object.defineProperty({},"message",{
//     configurable:true,
//     enumerable:true,
//     get(){
//         console.log("get>>>")
//     },
//     set(newVal){
//         console.log(newVal)
//     }
// } )
// console.log(data)
// delete data["message"]
// console.log(data)
var data={
    name:1
}
function observe(data){
    for(key in data){
        let value = data[key]
        Object.defineProperty(data,key,{
            configurable:true,
            enumerable:true,
            get(){
                console.log("get..")
                return value
            },
            set(newVal){
                console.log("set..")
                return newVal
            }
        })
    }
}
observe(data)
data.name = "111"
console.log(data)