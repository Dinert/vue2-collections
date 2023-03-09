
const addLayer = function (map, layers) {
    const name = layers && layers.CLASS_NAME
    if (Object.prototype.toString.call(layers) === '[object Array]') {
        for (let i = 0; i < layers.length; i++) {
            map.add(layers[i])
            if (name === 'Loca.PointLayer' || name === 'Loca.ScatterPointLayer') {
                layers[i].render()
            }
        }
    } else {
        map.add(layers)
        if (name === 'Loca.PointLayer' || name === 'Loca.ScatterPointLayer') {
            layers.render()
        }
    }
}

export default addLayer
