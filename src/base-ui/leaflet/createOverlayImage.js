import L from 'leaflet'
import setView from './setView'
import _ from 'lodash'


const createOverlayImage = function(map, options) {
    const defaultOptions = {
        url: '',
        path: {},
        className: 'overlayImage'
    }
    return new Promise(function (resolve, reject) {
        let newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)

        let path = newOptions.path;
        if (!newOptions.path._northEast) {
            for (let i = 0; i < path.length; i++) {
                path = path.concat(path[i]);
            }
            path = path.filter(function (item) {
                return item.reverse();
            });
        }

        newOptions = (typeof newOptions.configCallback === 'function' && newOptions.configCallback(newOptions)) || newOptions;
        let layerImage = L.imageOverlay(newOptions.url, path, newOptions);
        map.addLayer(layerImage);
        newOptions.setView && setView(map, layerImage.getBounds());
        resolve(layerImage);
    });
}

export default createOverlayImage
