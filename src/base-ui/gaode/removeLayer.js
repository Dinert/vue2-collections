const removeLayer = function (map, layers) { // 删除图层
    if (Object.prototype.toString.call(layers) === '[object Array]') {
        for (let i = 0; i < layers.length; i++) {
            map.remove(layers[i])
        }
    } else {
        map.remove(layers)

    }
}

export default removeLayer
