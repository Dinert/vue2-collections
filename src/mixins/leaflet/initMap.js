import initMap from '@/base-ui/leaflet/initMap'
import setView from '@/base-ui/leaflet/setView'

export default {
    data() {
        return {
            leafletMap: null,
            leafletId: 'map'
        }
    },
    methods: {
        setView(latLng, size) {
            setView(this.leafletMap, latLng, size)
        },
        async initMap() {

            await this.$nextTick()
            this.leafletMap = await initMap(this.leafletId)
        },
    }

}
