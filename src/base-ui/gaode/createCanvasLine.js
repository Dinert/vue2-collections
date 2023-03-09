import _ from 'lodash'
import {getAir} from '@/utils/air'

const createCanvasLine = function (map, options, callback) { // 创建canvas线

    const defaultOptions = {
        path: [],
        type: 'AQI',
        lng: '经度浓度',
        lat: '纬度浓度',
        alwaysRender: true, // 缩放过程中是否重绘，复杂绘制建议设为false
        zIndex: 120,
        canvas: {
            lineWidth: 6,
            lineCap: 'round'
        }
    }

    return new Promise((resolve, reject) => {
        const newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)


        const canvas = document.createElement('canvas')

        const data = newOptions.path
        const type = newOptions.type
        const lngLat = options.lngLat || ['经度浓度', '纬度浓度']
        const onRender = function () {
            const retina = AMap.Browser.retina
            const size = map.getSize()
            let width = size.width
            let height = size.height

            canvas.width = width
            canvas.height = height
            if (retina) { // 高清适配
                width *= 2
                height *= 2
            }
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            ctx.lineWidth = newOptions.canvas.lineWidth
            ctx.lineCap = newOptions.canvas.lineCap

            for (let i = 1; i < data.length; i++) {
                const pos1 = map.lngLatToContainer(new AMap.LngLat(data[i - 1][newOptions.lng], data[i - 1][newOptions.lat]))
                const pos2 = map.lngLatToContainer(new AMap.LngLat(data[i][newOptions.lng], data[i][newOptions.lat]))
                const value1 = data[i - 1][type] || 0
                const value2 = data[i][type] || 0
                const grad = ctx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y)
                grad.addColorStop(0, getAir(type, value1).color)
                grad.addColorStop(1, getAir(type, value2).color)
                ctx.strokeStyle = grad
                ctx.beginPath()
                ctx.moveTo(pos1.x, pos1.y)
                ctx.lineTo(pos2.x, pos2.y)
                ctx.stroke()
            }
            return canvas
        }

        const customLayer = new AMap.CustomLayer(canvas, newOptions)

        customLayer.render = onRender

        map.add(customLayer)

        options.hide && customLayer.hide()
        resolve(customLayer)
    })
}


export default createCanvasLine
