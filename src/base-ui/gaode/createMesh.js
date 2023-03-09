import _ from 'lodash'
import {getAir} from '@/utils/air'

const createMesh = function (map, options) { // 创建面
    const defaultOptions = {
        path: [],
        type: 'AQI',
        lng: '经度浓度',
        lat: '纬度浓度'
    }

    return new Promise((resolve, reject) => {

        const newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)

        const data = newOptions.path
        const meshs = []
        const meshLayers = new AMap.Object3DLayer()

        for (let i = 1; i < data.length; i++) {
            const lng = data[i][newOptions.lng]
            const lat = data[i][newOptions.lat]
            const lng2 = data[i - 1][newOptions.lng]
            const lat2 = data[i - 1][newOptions.lat]

            // 算出三维坐标
            const v0xy = map.lngLatToGeodeticCoord(new AMap.LngLat(lng, lat))
            const v1xy = map.lngLatToGeodeticCoord(new AMap.LngLat(lng2, lat2))

            const mesh = new AMap.Object3D.Mesh()
            const geometry = mesh.geometry

            let height = data[i - 1][newOptions.type] || 0
            let height2 = data[i][newOptions.type] || 0

            height2 = height2 * 500
            height = height * 500

            const value = data[i - 1][newOptions.type]
            const value2 = data[i][newOptions.type]
            const color = AMap.Util.color2RgbaArray(getAir(newOptions.type, value).color)
            const color2 = AMap.Util.color2RgbaArray(getAir(newOptions.type, value2).color)


            // 面2
            geometry.vertices.push(v0xy.x, v0xy.y, -height)
            geometry.vertices.push(v1xy.x, v1xy.y, -height2)
            geometry.vertices.push(v1xy.x, v1xy.y, 0)
            geometry.vertices.push(v0xy.x, v0xy.y, 0)

            // 角度
            geometry.faces.push(0, 1, 3)
            geometry.faces.push(1, 2, 3)
            geometry.faces.push(1, 0, 3)
            geometry.faces.push(2, 1, 3)

            // 颜色
            geometry.vertexColors.push(color2[0], color2[1], color2[2], color2[3]) // V0
            geometry.vertexColors.push(color[0], color[1], color[2], color[3]) // V1
            geometry.vertexColors.push(color[0], color[1], color[2], color[3]) // V1
            geometry.vertexColors.push(color2[0], color2[1], color2[2], color2[3]) // V0

            mesh.transparent = true // 支持透明度
            typeof newOptions.configCallback === 'function' && newOptions.configCallback(mesh, geometry)
            meshs.push(mesh)

            meshLayers.add(mesh)
            typeof newOptions.callback === 'function' && newOptions.callback(mesh, geometry)
        }
        map.add(meshLayers)

        resolve(meshLayers)
    })
}

export default createMesh
