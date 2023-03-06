<template>
    <section class="map">
        <div id="map"></div>
        <div class="map-search">
            <el-button type="primary" class="flag"
                @click="toggle"
            >{{ flag ? '关闭图片' : '打开图片' }}</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
        </div>
    </section>
</template>

<script>


import initMapMixins from '@/mixins/leaflet/initMap'
import createControlMixins from '@/mixins/leaflet/createControl'
import createOverlayImage from '@/mixins/leaflet/createOverlayImage'

const AQIImage =  require('@/assets/img/common/AQI.png')

export default {
    name: 'Region',
    mixins: [initMapMixins, createControlMixins, createOverlayImage],
    async created() {
        await this.initMap()
        this.createControl()
        var corner1 = L.latLng(57.363624, 152.59567),
            corner2 = L.latLng(9.83703, 60.502355),
            bounds = L.latLngBounds(corner1, corner2);
        this.createOverlayImage({path: bounds, url: AQIImage, setView: true})
    },

    data() {
        return {
            flag: true
        }
    },
    methods: {
        toggle() {
            if(this.flag) {
                this.leafletMap.removeLayer(this.leafletRenderImage)
                this.flag = false
            }else {
                this.leafletMap.addLayer(this.leafletRenderImage)
                this.flag = true
            }
        },
        reset() {
            if(this.flag) {
                this.setView(this.leafletRenderImage.getBounds())
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
