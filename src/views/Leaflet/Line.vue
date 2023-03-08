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


import initMapMixins from '@/mixins/leaflet/initMap'
import createControlMixins from '@/mixins/leaflet/createControl'
import createLine from '@/mixins/leaflet/createLine'

const aerialVehiclesJSON =  require('@/assets/json/AerialVehicles.json')

export default {
    name: 'Region',
    mixins: [initMapMixins, createControlMixins, createLine],
    async created() {
        await this.initMap()
        this.createControl()

        this.createLine({path: aerialVehiclesJSON, setView: true,weight: 6})
    },

    data() {
        return {
            flag: true
        }
    },
    methods: {
        toggle() {
            if(this.flag) {
                this.leafletMap.removeLayer(this.leafletLine)
                this.flag = false
            }else {
                this.leafletMap.addLayer(this.leafletLine)
                this.flag = true
            }
        },
        reset() {
            if(this.flag) {
                this.setView(this.leafletLine.getLayers()[0].getBounds())
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.map {
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
