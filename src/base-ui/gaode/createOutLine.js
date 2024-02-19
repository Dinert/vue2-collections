import _ from 'lodash'

const createOutLine = function (map, options) { // 创建地图轮廓

    const defaultOptions = {
        strokeWeight: 2,
        fillOpacity: 0.4,
        fillColor: '#80d8ff',
        strokeColor: '#0091ea'
    }

    return new Promise(resolve => {
        const newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)
        const polygons = []
        for (let i = 0; i < newOptions.path.length; i++) {
            const polygon = new AMap.Polygon({
                ...newOptions,
                path: newOptions.path[i]
            })
            polygons.push(polygon)
        }

        const polygonLayers = new AMap.OverlayGroup(polygons)
        map.add(polygonLayers)

        newOptions.setView && map.setFitView(polygons, true)
        resolve(polygonLayers)
    })

}

export default createOutLine
