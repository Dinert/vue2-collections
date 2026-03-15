import _ from 'lodash'
import AMapLoader from '@amap/amap-jsapi-loader'

const initMap = (id, options, loadOptions) => {

    AMapLoader.reset && AMapLoader.reset()

    const defaultOptions = {
        zoom: 5, // 初始化地图级别
        center: [105.602725, 37.076636], // 初始化地图中心点位置
    }


    return new Promise((resolve, reject) => {

        const newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)


        const newLoadOptions = _.defaultsDeep(_.cloneDeep(loadOptions), {
            key: 'ab5526c9d205b1ee377b16330f4b314c',
            version: '2.0',
            plugins: [],
        })

        if (newLoadOptions.key === 'ab5526c9d205b1ee377b16330f4b314c') {
            window._AMapSecurityConfig = {
                securityJsCode: '21f7ccacf1387ef689253e42c48d7343',
                serviceHost: '/_AMapService', // 设置代理
                cache: true, // 启用缓存
                load: 'sync' // 同步加载
            }
        } else {
            window._AMapSecurityConfig = {
                securityJsCode: '530231bc60a6258f7fa6b84d5d532761',
            }
        }

        AMapLoader.load(newLoadOptions).then(AMap => {
            const map = new AMap.Map(id, newOptions)
            resolve(map)
        }).catch(e => {
            reject(e)
        })
    })

}

export default initMap
