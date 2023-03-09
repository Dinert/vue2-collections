import _ from 'lodash'

import {getAir} from '@/utils/air'

const cylinderData = function (data) { // 3D圆柱的数据组装
    const result = []
    for (let i = 0; i < data.length; i++) {
        const lnglat = []
        lnglat.push(Number(data[i]['经度浓度']) || Number(data[i]['经度']) || Number(data[i].Longitude), Number(data[i]['纬度浓度']) || Number(data[i]['纬度']) || Number(data[i].Latitude))
        data[i].lnglat = lnglat
        result.push(data[i])
    }
    return result
}


const createCylinder = function (map, options) { // 创建圆柱
    const defaultOptions = {
        unit: 'meter',

        style: {
            // 正多边形半径
            radius: 20,
            height: function (res) {
                const value = (res.value[options.type] * 100) || 0
                return value
            },

            // 顶边颜色
            color: function (res) {
                const value = res.value[options.type] || 0

                const color = getAir(options.type, value).color
                return color
            }
        },
        selectStyle: {
            opacity: 0.2
        },
        offset: [130, 100]
    }

    return new Promise((resolve, reject) => {
        const newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)

        const scatterPointLayer = new Loca.ScatterPointLayer({
            map: map,
            eventSupport: true,
        })

        newOptions.path = cylinderData(newOptions.path)

        scatterPointLayer.setData(newOptions.path, {
            lnglat: 'lnglat'
        })


        let infoWin
        scatterPointLayer.on('mousemove', e => {
            const event = e.originalEvent
            const data = e.rawData
            if (!infoWin) {
                infoWin = new AMap.InfoWindow({
                    autoMove: false,
                    isCustom: true, // 使用自定义窗体
                    offset: new AMap.Pixel(newOptions.offset[0], newOptions.offset[1])
                })
            }
            let content = '<div class="cylinderInfo">'
                + '<p class="cylinderInfo-car"><strong>站点：</strong><span>' + data.StationId + '</span></p>'
                + '<p class="cylinderInfo-time"><strong>时间：</strong><span>' + data.TimePoint + '</span></p>'
                + '<p class="cylinderInfo-type"><strong>' + newOptions.type + '：</strong><span>' + data[newOptions.type] + '</span></p>'
                + '<p class="cylinderInfo-value"><strong>首要污染物：</strong><span>' + data['首要污染物'] + '</span></p>'
                + '</div>'
            content = typeof newOptions.moveCallback === 'function' && newOptions.moveCallback(e) ? newOptions.moveCallback(e) : content
            infoWin.setContent(content)
            const x = event.offsetX
            const y = event.offsetY
            const lngLat = map.containerToLngLat(new AMap.Pixel(x, y))
            infoWin.open(map, lngLat)
        })

        scatterPointLayer.on('mouseleave', e => {
            map.clearInfoWindow()
        })

        scatterPointLayer.setOptions(newOptions)
        scatterPointLayer.render()

        newOptions.setView && scatterPointLayer.setFitView()

        newOptions.pitch && map.setPitch(newOptions.pitch)

        newOptions.zoom && map.setZoom(newOptions.zoom)
        newOptions.hide && scatterPointLayer.hide()

        resolve(scatterPointLayer)
    })
}

export default createCylinder
