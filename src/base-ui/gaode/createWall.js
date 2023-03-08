
import _ from 'lodash'

const createWall = function (map, options) {
    const defaultOptions = {
        path: [],
        strokeColor: '#99ffff',
        strokeWeight: 4,
        height: -80000,
        color: '#0088ffcc',
        zIndex: 2,
        transparent: true
    }

    return new Promise(function (resolve, reject) {
        let newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)

        const object3Dlayer = new AMap.Object3DLayer({ zIndex: newOptions.zIndex });
        const wall = new AMap.Object3D.Wall(newOptions);
        wall.transparent = true;

        for(let i = 0; i < newOptions.path.length; i ++) {
            new AMap.Polyline({
                path:newOptions.path[i],
                strokeColor:'#99ffff',
                strokeWeight:4,
                map
            })
        }

        object3Dlayer.add(wall)
        map.add(object3Dlayer);
        newOptions.cityName && map.setCity(newOptions.cityName)
        newOptions.pitch && map.setPitch(newOptions.pitch)
        resolve(object3Dlayer)
    })
}

export default createWall