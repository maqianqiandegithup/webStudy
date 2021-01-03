//数组转树 
const arr = [
        { id: 1, parentId: null, name: 'a' },
        { id: 2, parentId: null, name: 'b' },
        { id: 3, parentId: 1, name: 'c' },
        { id: 4, parentId: 2, name: 'd' },
        { id: 5, parentId: 1, name: 'e' },
        { id: 6, parentId: 3, name: 'f' },
        { id: 7, parentId: 4, name: 'g' },
        { id: 8, parentId: 7, name: 'h' },
    ]
    // 例如将 input 转成output的形式
let input = [{ id: 1, val: '学校', parentId: null },
    { id: 2, val: '班级1', parentId: 1 },
    { id: 3, val: '班级2', parentId: 1 },
    { id: 4, val: '学生1', parentId: 2 },
    { id: 5, val: '学生2', parentId: 3 },
    { id: 6, val: '学生3', parentId: 3 }
]



// 利用的就是数组的索引.map数组法
function arrayToTree(arr) {
    if (!Array.isArray(arr) || !arr.length) return
    let map = {}
    arr.forEach(elem => map[elem.id] = elem);
    let roots = []
    arr.forEach(ele => {
        let parent = map[ele.parentId]
        if (parent) {
            (parent.children || (parent.children = [])).push(ele)
        } else { roots.push(ele) }
    })
    return roots
}
//使用递归的方法
function arrayToTree2(data, pid) {
    let res = []
    data.forEach(item => {
        if (item.parentId === pid) {
            let arayChild = arrayToTree2(data, item.id);
            !arayChild.length && (item.children = arayChild);
        }
    })
    return res
};
//树转数组
//广度优先
function bfs(data, fVisit) {
    let quuen = Array.isArray(data) ? [...data] : [data]
    while (quuen.length) {
        let node = quuen.shift()
        fVisit && fVisit(node)
        if (node.children && node.children.length > 0) {
            node.children.forEach(v => {
                quuen.push(v)
            })
        }
    }
}
let tree = arrayToTree(arr)
console.log(tree)
let a1 = []
bfs(tree, v => a1.push(v))
console.log(a1)