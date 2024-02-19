<template>
    <section class="map">
        <div id="map"></div>
        <div class="map-search">
            <el-button type="primary" class="flag"
                @click="toggle"
            >{{ flag ? '关闭路线' : '打开路线' }}</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
        </div>
    </section>
</template>

<script>


import initMap from '@/base-ui/leaflet/initMap'
import createControl from '@/base-ui/leaflet/createControl'
import createLine from '@/base-ui/leaflet/createLine'
import setView from '@/base-ui/leaflet/setView'


const aerialVehiclesJSON = require('@/assets/json/AerialVehicles.json')

let leafletMap = null
let leafletLine = null
export default {
    name: 'Region',
    async mounted() {
        leafletMap = await initMap(this.leafletId)
        createControl(leafletMap, {layerName: '智图-默认图层'})

        leafletLine = await createLine(leafletMap, {path: aerialVehiclesJSON, setView: true, weight: 6})

        this.$notify.success({
            title: '成功',
            message: '绘制路线',

        })
    },

    data() {
        return {
            flag: true,
            leafletId: 'map'
        }
    },
    methods: {
        toggle() {
            if (this.flag) {
                leafletMap.removeLayer(leafletLine)
                this.flag = false
            } else {
                leafletMap.addLayer(leafletLine)
                this.flag = true
            }
        },
        reset() {
            if (this.flag) {
                setView(leafletMap, leafletLine.getLayers()[0].getBounds())
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.map {
    position: relative;
    width: 100%;
    height: 100%;

    #map {
        z-index: 0;
        width: 100%;
        height: 100%;
    }

    &-search {
        position: absolute;
        top: 30px;
        left: 50%;
        text-align: center;
        transform: translate(-50%);
    }
}
</style>
