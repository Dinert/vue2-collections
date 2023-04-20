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

const AQIImage = require('@/assets/img/common/AQI.png')

export default {
    name: 'Region',
    mixins: [initMapMixins, createControlMixins, createOverlayImage],
    async created() {
        await this.initMap()
        this.createControl()
        const corner1 = L.latLng(57.363624, 152.59567)
        const corner2 = L.latLng(9.83703, 60.502355)
        const bounds = L.latLngBounds(corner1, corner2)
        this.createOverlayImage({path: bounds, url: AQIImage, setView: true})


        this.$notify.success({
            title: '成功',
            message: '使用后端生成好的图片的空气质量渲染差值图，根据不同污染物的等级渲染不同的颜色！可根据不同区域进行渲染！',
            duration: 0
        })
    },

    data() {
        return {
            flag: true
        }
    },
    methods: {
        toggle() {
            if (this.flag) {
                this.leafletMap.removeLayer(this.leafletRenderImage)
                this.flag = false
            } else {
                this.leafletMap.addLayer(this.leafletRenderImage)
                this.flag = true
            }
        },
        reset() {
            if (this.flag) {
                this.setView(this.leafletRenderImage.getBounds())
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
