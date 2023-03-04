import initMap from '@/base-ui/leaflet/initMap'

export default {
    data() {
        return {
            leafletMap: null,
            leafletId: 'map'
        }
    },
    methods: {
        async initMap() {

            await this.$nextTick()
            this.leafletMap = await initMap(this.leafletId)
        },
    }

}