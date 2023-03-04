
import L from 'leaflet'
import 'leaflet.chinatmsproviders'
import _ from 'lodash'

const initMap = (id, options) => {
    const defaultOptions = {
        layers: [L.tileLayer.chinaProvider("GaoDe.Normal.Map", {
            minZoom: 1,
            maxZoom: 18,
        })],
        center: [35, 110],
        maxZoom: 18,
        minZoom: 3,
        zoom: 4,
        attributionControl: false
    }
    let newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)
    return new Promise((resolve, reject) => {
        if(!id) {
            reject(new Error('实例化id是必填项'))
        }
        const map = L.map(id, newOptions)
        resolve(map)
    })
}


export default initMap