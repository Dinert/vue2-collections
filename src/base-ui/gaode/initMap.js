import _ from 'lodash'
import AMapLoader from '@amap/amap-jsapi-loader'

const initMap = (id, options, loadOptions) => {
    AMapLoader.reset && AMapLoader.reset()

    const defaultOptions = {
        zoom:5,           //初始化地图级别
        center:[105.602725,37.076636], //初始化地图中心点位置
    }


    return new Promise((resolve, reject) => {

        let newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)

        AMapLoader.load({
            key: '42cf421fce690f0566ec730bba75d72a',
            version: '2.0',
            plugins: [],
            ...loadOptions
        }).then(AMap => {
            const map = new AMap.Map(id, newOptions)
            resolve(map)
        }).catch(e=>{
            reject(e)
        })
    })

}

export default initMap