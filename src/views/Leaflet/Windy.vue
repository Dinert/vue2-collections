<template>
    <div id="map">
    </div>
</template>

<script>

import L from 'leaflet'
import 'leaflet.chinatmsproviders'

export default {
    name: 'Windy',
    created() {

        var normalMap = L.tileLayer.chinaProvider("GaoDe.Normal.Map", {
            minZoom: 1,
            maxZoom: 18,
        });
        var normalMap2 = L.tileLayer.chinaProvider("GaoDe.Satellite.Map", {
            minZoom: 1,
            maxZoom: 18,
        });

        console.log(normalMap, 'normalMappppppppp')
        this.$nextTick(() => {
            this.map = new L.map("map", {
                center: [35, 110],
                layers: [normalMap],
                maxZoom: 18,
                minZoom: 3,
                zoom: 4,
                attributionControl: false
            });

        })
    },
    data() {
        return {
            map: null
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
