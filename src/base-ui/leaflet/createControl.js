import L from 'leaflet'
import 'leaflet.chinatmsproviders'

const createControl = (map, options = {layerName: '智图-默认图层'}) => {
    return new Promise((resolve, reject) => {
        const mapMapName = {
            GaoDe: '高德',
            Geoq: '智图',
            Google: '谷歌',
            TianDiTu: '天地图',
            Tencent: '腾讯',
            OSM: 'OSM',
            Baidu: '百度'
        }
        const mapLayersName = {
            Normal: '默认图层',
            Satellite: '卫星图层',
            Terrain: '地形图层'
        }

        const mapStyleName = {
            Map: '默认',
            Color: '颜色',
            PurplishBlue: '暗蓝色',
            Gray: '灰色',
            Warm: '水色',
            Cold: '酷色'
        }

        const provides = L.TileLayer.ChinaProvider.providers
        const tempObj = {}
        const tempNameObj = {}
        const layersObj = {}

        for (const prop in provides) {
            const mapLayers = provides[prop]
            for (const prop2 in mapLayers) {
                if (['Normal', 'Satellite', 'Terrain'].includes(prop2)) {
                    for (const prop3 in mapLayers[prop2]) {

                        if (prop3 !== 'Annotion') {
                            tempObj[prop + '.' + prop2 + '.' + prop3] = mapLayers[prop2][prop3]
                            tempNameObj[prop + '.' + prop2 + '.' + prop3] = mapStyleName[prop3] === '默认' ? mapMapName[prop] + '-' + mapLayersName[prop2] : mapMapName[prop] + '-' + mapLayersName[prop2] + '-' + mapStyleName[prop3]
                        }
                    }
                }
            }
        }

        for (const prop in tempObj) {
            layersObj[tempNameObj[prop]] = L.tileLayer.chinaProvider(prop, {
                minZoom: 1,
                maxZoom: 18,
                ...options
            })
        }

        map.addLayer(layersObj[options.layerName])
        const control = L.control.layers(layersObj)
        map.addControl(control)
        resolve(control)
    })

}

export default createControl
