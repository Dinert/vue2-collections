import _ from 'lodash'
import AMapLoader from '@amap/amap-jsapi-loader'
let lastMapOptions = {}
window._AMapSecurityConfig = {
    securityJsCode: '530231bc60a6258f7fa6b84d5d532761',
}
const initMap = (id, options, loadOptions) => {

    AMapLoader.reset && AMapLoader.reset()

    const defaultOptions = {
        zoom: 5, // 初始化地图级别
        center: [105.602725, 37.076636], // 初始化地图中心点位置
    }


    return new Promise((resolve, reject) => {

        const newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)
        const newLoadOptions = _.defaultsDeep(_.cloneDeep(loadOptions), {
            key: '720d49e9651522b9b4661195147dc067',
            version: '2.0',
            plugins: [],
        })

        AMapLoader.load(newLoadOptions).then(AMap => {
            lastMapOptions = newLoadOptions
            console.log(lastMapOptions, 'lastMapOptions')

            const map = new AMap.Map(id, newOptions)
            resolve(map)
        }).catch(e => {
            reject(e)
        })
    })

}

export default initMap
