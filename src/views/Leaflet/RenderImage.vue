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


import initMap from '@/base-ui/leaflet/initMap'
import createControl from '@/base-ui/leaflet/createControl'
import createOverlayImage from '@/base-ui/leaflet/createOverlayImage'
import setView from '@/base-ui/leaflet/setView'


const AQIImage = require('@/assets/img/common/AQI.png')

let map = null
let leafletRenderImage = null
export default {
    name: 'Region',
    async mounted() {
        map = await initMap(this.leafletId)
        createControl(map, {layerName: '智图-默认图层'})
        const corner1 = L.latLng(57.363624, 152.59567)
        const corner2 = L.latLng(9.83703, 60.502355)
        const bounds = L.latLngBounds(corner1, corner2)
        leafletRenderImage = await createOverlayImage(map, {path: bounds, url: AQIImage, setView: true})


        this.$notify.success({
            title: '成功',
            message: '使用后端生成好的图片的空气质量渲染差值图，根据不同污染物的等级渲染不同的颜色！可根据不同区域进行渲染！',

        })
    },

    data() {
        return {
            leafletId: 'map',
            flag: true
        }
    },
    methods: {
        toggle() {
            if (this.flag) {
                map.removeLayer(leafletRenderImage)
                this.flag = false
            } else {
                map.addLayer(leafletRenderImage)
                this.flag = true
            }
        },
        reset() {
            if (this.flag) {
                setView(map, leafletRenderImage.getBounds())
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
