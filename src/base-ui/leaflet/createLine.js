import L from 'leaflet'
import setView from './setView'
import _ from 'lodash'

const createOutLine = function(map, options) {
    const defaultOptions = {
        path: [],
        weight: 2,
        latLng: ['纬度浓度', '经度浓度'],
        style: {
        },
    }
    return new Promise(function (resolve, reject) {
        let newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)

        let data = newOptions.path;
        let latLngs = [];
        let lines = [];
        for (let i = 1; i < data.length; i++) {
            let first = [data[i - 1][newOptions.latLng[0]], data[i - 1][newOptions.latLng[1]]];
            let second = [data[i][newOptions.latLng[0]], data[i][newOptions.latLng[1]]];
            if (newOptions.isSubsec) {
                let line = L.polyline([first, second], newOptions);
                lines.push(line);
            }
            latLngs.push(first);
        }
        if (!newOptions.isSubsec) {
            let line = L.polyline(latLngs, newOptions);
            lines.push(line);
        }
        let layerLine = L.layerGroup(lines);
        map.addLayer(layerLine);
        newOptions.setView && setView(map, latLngs);
        resolve(layerLine);
    });
}

export default createOutLine