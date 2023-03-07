import _ from 'lodash'
import {getAir} from '@/utils/air'


const cylinderData = function (data) {  // 3D圆柱的数据组装
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var lnglat = [];
        lnglat.push(Number(data[i]['经度浓度']) || Number(data[i]['经度']) || Number(data[i]['Longitude']), Number(data[i]['纬度浓度']) || Number(data[i]['纬度']) || Number(data[i]['Latitude']));
        data[i].lnglat = lnglat;
        result.push(data[i]);
    }
    return result;
}

const createPoint = function (map, options) {    // 创建点
    const defaultOptions = {
        style: {
            radius: 10,
            color: function (res) {
                let type = options.type || 'AQI'
                var value = res.value[type] || 0;
                var color = getAir(type, value).color
                return color;
            },
            opacity: 0.8
        },
        selectStyle: {
            radius: 14,
            borderWidth: 1,
        }
    }


    return new Promise(function (resolve, reject) {
        let newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)

        var pointLayer = new Loca.PointLayer({
            eventSupport: true,
            map: map
        });

        newOptions.path = cylinderData(newOptions.path);

        pointLayer.setData(newOptions.path, {
            lnglat: 'lnglat'
        });

        var infoWin;
        pointLayer.on('mousemove', (e) => {
            var event = e.originalEvent;
            var data = e.rawData;
            if (!infoWin) {
                infoWin = new AMap.InfoWindow({
                    autoMove: false,
                    isCustom: true,  //使用自定义窗体
                    offset: new AMap.Pixel(130, 100)
                });
            }
            var content = '<div class="cylinderInfo">' +
                '<p class="cylinderInfo-car"><span>站点：</span><b>' + data.StationId + '</b></p>' +
                '<p class="cylinderInfo-time"><span>时间：</span><b>' + data.TimePoint + '</b></p>' +
                '<p class="cylinderInfo-value"><span>' + newOptions.type + '：</span><b>' + data[newOptions.type] + '</b></p>' +
                '<p class="cylinderInfo-value"><span>首要污染物：</span><b>' + data['首要污染物'] + '</b></p>' +
                '</div>';
            infoWin.setContent(content);

            var x = event.offsetX;
            var y = event.offsetY;
            var lngLat = map.containerToLngLat(new AMap.Pixel(x, y));
            infoWin.open(map, lngLat);
        });

        pointLayer.on('mouseleave', (e) => {
            map.clearInfoWindow();
        });

        pointLayer.setOptions(newOptions);
        pointLayer.render();

        newOptions.setView && pointLayer.setFitView();
        newOptions.pitch && map.setPitch(newOptions.pitch);
        newOptions.zoom && map.setZoom(newOptions.zoom);
        newOptions.hide && pointLayer.hide();

        resolve(pointLayer);
    });
}

export default createPoint