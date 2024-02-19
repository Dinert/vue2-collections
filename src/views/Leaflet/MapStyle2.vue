<template>
    <div id="map">
    </div>
</template>

<script>


import initMap from '@/base-ui/leaflet/initMap'
import createControl from '@/base-ui/leaflet/createControl'


export default {
    name: 'Windy',
    async mounted() {
        const map = await initMap(this.leafletId)
        createControl(map, {layerName: '智图-默认图层'})
        console.log('测试一下1')


        this.$notify.success({
            title: '成功',
            message: '请尝试右上角的切换地图风格图层'
        })
    },
    data() {
        return {
            leafletId: 'map'
        }
    }
}
</script>

<style lang="scss" scoped>
#map {
    z-index: 0;
    width: 100%;
    height: 100%;
}
</style>
