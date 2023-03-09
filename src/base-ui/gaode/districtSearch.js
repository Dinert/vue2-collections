
import _ from 'lodash'

const districtSearch = function (options) { // 查询行政区域多个

    const defaultOptions = {
        subdistrict: 0, //
        extensions: 'all',
        level: 'district',
        origin: true
    }

    return new Promise((resolve, reject) => {
        const newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)

        const district = new AMap.DistrictSearch(newOptions)

        newOptions.mask = typeof newOptions.mask === 'string' ? [newOptions.mask] : newOptions.mask

        let count = 0
        const tempArr = []
        const tempArr2 = []
        const boundsArr = []
        const outLineArr = []
        for (let i = 0; i < newOptions.mask.length; i++) {
            const name = newOptions.mask[i]
            district.search(name, (status, result) => {
                count++
                if (status === 'complete') {
                    const content = result.districtList[0]
                    const bounds = result.districtList[0].boundaries
                    outLineArr.push(bounds)
                    if (newOptions.origin) {
                        for (var j = 0; j < bounds.length; j++) {
                            tempArr.push([bounds[j]])
                            boundsArr.push(bounds[j])
                        }
                        var tempObj = {mask: tempArr, bounds: boundsArr, outLine: outLineArr, content: content}
                        if (count === newOptions.mask.length) {

                            resolve(tempObj)

                        }
                    } else {

                        for (let i = 0; i < bounds.length; i++) {
                            for (var j = 0; j < bounds[i].length; j++) {
                                tempArr.push([bounds[i][j].lng, bounds[i][j].lat])
                            }
                            tempArr2.push(tempArr)
                            boundsArr.push(bounds[i])
                        }
                        var tempObj = {mask: tempArr, bounds: boundsArr, outLine: outLineArr, content: content}

                        if (count === options.mask.length) {
                            resolve(tempObj)
                        }
                    }
                } else {
                    reject({
                        status: 0,
                        msg: '查找失败'
                    })
                }
            })
        }

    })
}

export default districtSearch
