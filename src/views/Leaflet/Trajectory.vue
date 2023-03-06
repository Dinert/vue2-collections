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

import '@/base-ui/leaflet/plugins/leaflet.BackTrajectory'

const backTrajectoryJSON =  require('@/assets/json/backTrajectory.json')

export default {
    name: 'Region',
    mixins: [initMapMixins, createControlMixins],
    async created() {
        await this.initMap()
        this.createControl()

        L.tileLayer.backTrajectory({
            data: backTrajectoryJSON,
            lineOptions: {},
            map: this.leafletMap
        }).init();
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
        right: 0;
        left: 0;
        margin: 0 auto;
        text-align: center;
    }
}
</style>
