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
