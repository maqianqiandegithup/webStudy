window.onload = function() {
    // 下划线和驼峰转化
    let toLine = name => {
        return name.replace(/[A-Z]/g, '_$1').toLowerCase()
    }

    let toHump = name => {
            return name.replace(/_(\w)/g, function(all, letter) {
                return letter.toUpperCase()
            })
        }
        // https://www.cnblogs.com/garfieldzhong/p/11654630.html

    //格式化金钱

    // 字符串转成txt
    function exportTxt(text, filename) {
        const eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 将内容转为 blob
        const blob = new Blob([text]);
        eleLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
    }
    const tasks = [{
                name: 'task1',
                time: 1,
                dependency: ''
            },
            {
                name: 'task2',
                time: 2,
                dependency: ''
            },
            {
                name: 'task3',
                time: 3,
                dependency: 'task1'
            },
        ]
        // 
    function gtTime(tasks) {
        function doevent(task) {
            return new Promise((resolve, reject) => {
                ele.dependency()
                resolve()
            })
        };
        tasks.forEach(ele => {
            if (!ele.dependency) {
                ele.pro = doevent(ele.name)
            } else {
                // 拿到promise
                doevent(ele.dependency)
            }
        });
    }
    // 遍历A中的属性值，从b中找到对应的属性值，进行赋值
    // 虽然可以用深拷贝实现同样的效果，但是深拷贝是全部拿过来了，有时候并不需要全部的属性。
    function copyProp(target, sources) {
        // 按需复制变量对象属性，只拿取target中需要的属性值
        for (let key in target) {
            if (target.hasOwnProperty(key)) {
                if (typeof sources[key] === 'object') {
                    target[key] = copyProp(target[key], sources[key])
                }
                // 如果target中的属性，b中没有，就会返回undefined
                target[key] = sources[key]
            }
        }
        return target
    };
}