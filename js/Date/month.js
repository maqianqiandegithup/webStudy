//返回两个给定日期之间的所有日期
function getMonths(start, end) {
    let startTime = new Date(start).getTime()
    let endTime = new Date(end).getTime()
    let result = []
    while (startTime < endTime) {
        let curTime = new Date(startTime)
        result.push(forMatDate(curTime))
        curTime.setMonth(curTime.getMonth() + 1)
        startTime = curTime.getTime()
    }
    return result.slice(1)
}

function forMatDate1(date) {
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`
}

function forMatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth()+1)>9?(date.getMonth()+1):'0'+(date.getMonth()+1)}`
}