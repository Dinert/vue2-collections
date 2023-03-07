import _ from 'lodash'

const createOutLine = function (map, options) {  // 创建地图轮廓

    const defaultOptions = {
        fillOpacity: 0,
        strokeWeight: 2,
        fillOpacity: 0.4,
        fillColor: '#80d8ff',
        strokeColor: '#0091ea'
    }

    return new Promise(function (resolve, reject) {
        let newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)
            let polygons = [];
            for(let i = 0; i < newOptions.path.length; i ++) {
                let polygon = new AMap.Polygon({
                    ...newOptions,
                    path: newOptions.path[i]
                });
                polygons.push(polygon);
            }

            let polygonLayers = new AMap.OverlayGroup(polygons);
            map.add(polygonLayers);

            newOptions.setView && map.setFitView(polygons, true);
            resolve(polygonLayers);
    });

}

export default createOutLine