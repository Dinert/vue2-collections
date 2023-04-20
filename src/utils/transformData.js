/**
 * 转selec的数据
 */


export const transformSelect = (selectData, value = 'id', label = 'name') => {
    const result = []
    selectData.forEach(item => {
        result.push({
            value: item[value],
            label: item[label]
        })
    })
    return result
}


/**
 * url转base64
 */

export const getBase64 = (url, callback) => {
    return new Promise(resolve => {
        const Img = new Image()
        let dataURL = ''
        Img.src = url + '?v=' + Math.random()
        Img.setAttribute('crossOrigin', 'Anonymous')
        Img.onload = function () {
            const canvas = document.createElement('canvas')
            const width = Img.width
            const height = Img.height
            canvas.width = width
            canvas.height = height
            canvas.getContext('2d').drawImage(Img, 0, 0, width, height)
            dataURL = canvas.toDataURL('png')
            callback && callback(dataURL)
            resolve(dataURL)
        }
    })
}

/**
 *
 * @param {String} str
 * @returns {Array} imgs
 */

export const stringGetImage = str => {
    const imgReg = /<img.*?(?:>|\/>)/gi // 匹配图片中的img标签
    // eslint-disable-next-line no-useless-escape
    const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
    const arr = str.match(imgReg) // 筛选出所有的img
    const srcArr = []
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            const src = arr[i].match(srcReg)
            srcArr.push(src[1])
        }
    }
    return srcArr
}

/**
 * 数据转-
 */

export const dataTransformRod = data => {
    return [null, undefined, ''].includes(data) ? '-' : data
}

/**
 * 树形结构拍扁
 *
 * @param {array} arr
 * @returns {array}
 */

export const treeTransArr = arr => {
    const res = []
    arr.forEach(item => {
        res.push(item)
        item.children && res.push(...treeTransArr(item.children))
    })
    return res
}


/**
 *
 * @param {stinrg} id
 * @returns
 * 映射图片地址
 */
export const ImageIdTransUrl = id => {
    if (id) {
        return `${window.location.origin}/ym/api/mediaInfo/download/${id}`
    }
    return ''
}

/**
 *
 * @param {Array} selectData
 * @param {String} value
 * @param {String} label
 * @returns {Object}
 */
export const transformSelectMap = (selectData, value = 'id', label = 'name') => {
    const select = []
    const map = {}
    selectData.forEach(item => {
        select.push({
            value: item[value],
            label: item[label]
        })
        map[item[value]] = item[label]
    })
    return {
        select,
        map
    }
}

/**
 * 万元转换
 */

export const handleAmount = (num, val = 10000) => {
    if (typeof num === 'undefined') {
        return 0
    }
    const data = (Number(num) / Number(val)) || 0
    return data
}

