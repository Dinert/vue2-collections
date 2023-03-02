<template>
    <div id="map">
    </div>
</template>

<script>


import initMapMixins from '@/mixins/leaflet/initMap'
import addControlMixins from '@/mixins/leaflet/addControl'
export default {
    name: 'Windy',
    mixins: [initMapMixins, addControlMixins],
    async created() {
        await this.initMap()
        this.addControl()
    },
    data() {
        return {

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
