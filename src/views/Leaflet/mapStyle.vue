<template>
    <div id="map">
    </div>
</template>

<script>


import initMapMixins from '@/mixins/leaflet/initMap'
import createControlMixins from '@/mixins/leaflet/createControl'

export default {
    name: 'Windy',
    mixins: [initMapMixins, createControlMixins],
    async created() {
        await this.initMap()
        this.createControl()

        this.$notify.success({
            title: '成功',
            message: '请尝试右上角的切换地图风格图层'
        })
    },
    data() {
        return {

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
