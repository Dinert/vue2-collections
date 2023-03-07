
import _ from 'lodash'

const districtSearch = function (options) { // 查询行政区域多个
    const defaultOptions = {
        subdistrict: 0, //
        extensions: 'all',
        level: 'district',
        origin: true
    }

    return new Promise(function (resolve, reject) {
        let newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)

        var district = new AMap.DistrictSearch(newOptions);

        newOptions.mask = typeof newOptions.mask === 'string' ? [newOptions.mask] : newOptions.mask

        var count = 0;
        var tempArr = [];
        var tempArr2 = [];
        var boundsArr = [];
        var outLineArr = [];
        for (var i = 0; i < newOptions.mask.length; i++) {
            var name = newOptions.mask[i];
            district.search(name, function (status, result) {
                count++;
                if (status === 'complete') {
                    var content = result.districtList[0];
                    var bounds = result.districtList[0].boundaries;
                    outLineArr.push(bounds);
                    if (newOptions.origin) {
                        for (var j = 0; j < bounds.length; j++) {
                            tempArr.push([bounds[j]]);
                            boundsArr.push(bounds[j]);
                        }
                        var tempObj = { mask: tempArr, bounds: boundsArr, outLine: outLineArr, content: content }
                        if(count === newOptions.mask.length) {

                            resolve(tempObj);

                        }
                    } else {

                        for (var i = 0; i < bounds.length; i++) {
                            for (var j = 0; j < bounds[i].length; j++) {
                                tempArr.push([bounds[i][j].lng, bounds[i][j].lat])
                            }
                            tempArr2.push(tempArr);
                            boundsArr.push(bounds[i]);
                        }
                        var tempObj = { mask: tempArr, bounds: boundsArr, outLine: outLineArr, content: content }

                        if(count === options.mask.length) {
                            resolve(tempObj);
                        }
                    }
                }else {
                    reject({
                        status: 0,
                        msg: '查找失败'
                    });
                }
            });
        }

    });
}

export default districtSearch