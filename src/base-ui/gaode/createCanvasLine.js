import _ from 'lodash'
import {getAir} from '@/utils/air'

const createCanvasLine = function (map, options, callback) {   // 创建canvas线

    const defaultOptions = {
        path: [],
        type: 'AQI',
        lng: '经度浓度',
        lat: '纬度浓度',
        alwaysRender: true, //缩放过程中是否重绘，复杂绘制建议设为false
        zIndex: 120,
        canvas: {
            lineWidth: 6,
            lineCap: 'round'
        }
    }

    return new Promise(function (resolve, reject) {
        let newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)


        var canvas = document.createElement('canvas');

        var data = newOptions.path;
        var type = newOptions.type;
        var lngLat = options.lngLat || ['经度浓度', '纬度浓度']
        var onRender = function () {
            var retina = AMap.Browser.retina;
            var size = map.getSize();
            var width = size.width;
            var height = size.height;

            canvas.width = width;
            canvas.height = height;
            if (retina) {    // 高清适配
                width *= 2;
                height *= 2;
            }
            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext("2d");
            ctx.lineWidth = newOptions.canvas.lineWidth;
            ctx.lineCap = newOptions.canvas.lineCap;

            for (var i = 1; i < data.length; i++) {
                var pos1 = map.lngLatToContainer(new AMap.LngLat(data[i - 1][newOptions.lng], data[i - 1][newOptions.lat]));
                var pos2 = map.lngLatToContainer(new AMap.LngLat(data[i][newOptions.lng], data[i][newOptions.lat]));
                var value1 = data[i - 1][type] || 0;
                var value2 = data[i][type] || 0;
                var grad = ctx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y)
                grad.addColorStop(0, getAir(type, value1).color);
                grad.addColorStop(1, getAir(type, value2).color);
                ctx.strokeStyle = grad;
                ctx.beginPath();
                ctx.moveTo(pos1.x, pos1.y);
                ctx.lineTo(pos2.x, pos2.y);
                ctx.stroke();
            }
            return canvas;
        }

        var customLayer = new AMap.CustomLayer(canvas, newOptions);

        customLayer.render = onRender;

        map.add(customLayer);

        options.hide && customLayer.hide();
        resolve(customLayer);
    });
}


export default createCanvasLine