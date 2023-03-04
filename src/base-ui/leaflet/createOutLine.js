import L from 'leaflet'
import setView from './setView'
import _ from 'lodash'

const createOutLine = function(map, options) {
    const defaultOptions = {
        path: [],
        type: 'Polygon',
        style: {
            fillOpacity: 0,
            weight: 2,
        },
    }
    return new Promise(function (resolve) {
        let newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)
        let data = newOptions.path;
        let type = newOptions.type;
        let geos = [];
        let maxLength = 0;
        let maxGeo;
        for (let i = 0; i < data.length; i++) {
            let latLngs = data[i];
            let configLatLng = { coordinates: [latLngs], type: type }
            newOptions.latLngs = latLngs;
            configLatLng = (typeof newOptions.configCallback === 'function' && newOptions.configCallback(configLatLng)) || configLatLng;
            let geo = L.geoJSON(configLatLng, newOptions);
            typeof newOptions.callback === 'function' && newOptions.callback.call(geo, geo);
            if (maxLength < latLngs.length) {
                maxLength = latLngs.length;
                maxGeo = geo
            }
            geos.push(geo);
        }
        let layerGeos = L.layerGroup(geos, {
            maxGeo: maxGeo
        });
        map.addLayer(layerGeos);
        newOptions.setView && setView(map, maxGeo.getBounds(), { animate: true });
        resolve(layerGeos);
    });
}

export default createOutLine