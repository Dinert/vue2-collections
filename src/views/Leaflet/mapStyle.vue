<template>
    <div id="map">
    </div>
</template>

<script>

import L from 'leaflet'
import 'leaflet.chinatmsproviders'

import leafletMixins from '@/mixins/leaflet'
export default {
    name: 'Windy',
    mixins: [leafletMixins],
    async created() {

        await this.initMap()
        this.addControl()
    },
    data() {
        return {
            mapMapName: {
                GaoDe: '高德',
                Geoq: '智图',
                Google: '谷歌',
                TianDiTu: '天地图',
                Tencent: '腾讯',
                OSM: 'OSM',
                Baidu: '百度'
            },
            mapLayersName: {
                Normal: '默认图层',
                Satellite: '卫星图层',
                Terrain: '地形图层'
            },
            mapStyleName: {
                Map: '默认',
                Color: '颜色',
                PurplishBlue: '暗蓝色',
                Gray: '灰色',
                Warm: '水色',
                Cold: '酷色'
            }
        }
    },
    methods: {

        addControl() {
            const provides = L.TileLayer.ChinaProvider.providers
            const tempObj = {}
            const tempNameObj = {}
            const layersObj = {}

            for(const prop in provides) {
                const mapLayers = provides[prop]
                for(const prop2 in mapLayers) {
                    if(['Normal', 'Satellite', 'Terrain'].includes(prop2)) {
                        for(const prop3 in mapLayers[prop2]) {

                            if(prop3 !== 'Annotion') {
                                tempObj[prop + '.' + prop2 + '.' + prop3] = mapLayers[prop2][prop3]
                                tempNameObj[prop + '.' + prop2 + '.' + prop3] = this.mapStyleName[prop3] === '默认' ? this.mapMapName[prop] + '-' + this.mapLayersName[prop2] :  this.mapMapName[prop] + '-' + this.mapLayersName[prop2] + '-' + this.mapStyleName[prop3]
                            }
                        }
                    }
                }
            }

            for(const prop in tempObj) {
                layersObj[tempNameObj[prop]] =  L.tileLayer.chinaProvider(prop, {
                    minZoom: 1,
                    maxZoom: 18,
                })
            }

            this.leafletMap.map.addLayer(layersObj['智图-默认图层'])
            this.leafletMap.map.addControl(L.control.layers(layersObj))
        }
    }
};
</script>

<style lang="scss" scoped>
#map {
    z-index: 0;
    width: 100%;
    height: 100%;
}
</style>
