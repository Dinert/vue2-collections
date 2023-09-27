import _ from 'lodash'
import AMapLoader from '@amap/amap-jsapi-loader'
let lastMapOptions = {}
const initMap = (id, options, loadOptions) => {
    const dom = document.querySelector(`script[src*="v=${lastMapOptions.version}"]`)
    dom && dom.remove()

    const locaDom = document.querySelector(`script[src*="v=${lastMapOptions.Loca && lastMapOptions.Loca.version}"]`)
    locaDom && locaDom.remove()


    AMapLoader.reset && AMapLoader.reset()

    const defaultOptions = {
        zoom: 5, // 初始化地图级别
        center: [105.602725, 37.076636], // 初始化地图中心点位置
    }


    return new Promise((resolve, reject) => {

        const newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)
        const newLoadOptions = _.defaultsDeep(_.cloneDeep(loadOptions), {
            key: '42cf421fce690f0566ec730bba75d72a',
            version: '2.0',
            plugins: [],
        })

        AMapLoader.load(newLoadOptions).then(AMap => {
            lastMapOptions = newLoadOptions

            const map = new AMap.Map(id, newOptions)
            resolve(map)
        }).catch(e => {
            reject(e)
        })
    })

}

export default initMap
