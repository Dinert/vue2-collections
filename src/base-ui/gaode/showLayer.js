

 const showLayer = function (layers) { // 打开图层

    if (Object.prototype.toString.call(layers) === '[object Array]') {
        for (var i = 0; i < layers.length; i++) {
            layers[i].show();
        }
    } else {
        layers.show();
    }

}

export default showLayer