
 const hideLayer = function (layers) {
    if (Object.prototype.toString.call(layers) === '[object Array]') {
        for (var i = 0; i < layers.length; i++) {
            layers[i].hide();
        }
    } else {
        layers.hide();
    }
}

export default hideLayer