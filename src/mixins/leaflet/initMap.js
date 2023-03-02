import L from 'leaflet'
import 'leaflet.chinatmsproviders'

export default {
    data() {
        return {
            leafletMap: {
                id: 'map',
                map: null,
                options: {
                    layers: [L.tileLayer.chinaProvider("GaoDe.Normal.Map", {
                        minZoom: 1,
                        maxZoom: 18,
                    })],
                    center: [35, 110],
                    maxZoom: 18,
                    minZoom: 3,
                    zoom: 4,
                    attributionControl: false
                }
            },
        }
    },
    methods: {
        async initMap() {

            await this.$nextTick()
            this.leafletMap.map = L.map(this.leafletMap.id, this.leafletMap.options)

        },
    }

}