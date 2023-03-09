import createOverlayImage from '@/base-ui/leaflet/createOverlayImage'

export default {
    data() {
        return {
            leafletRenderImage: null
        }
    },
    methods: {
        async createOverlayImage(options) {
            this.leafletRenderImage = await createOverlayImage(this.leafletMap, options)
        }
    }
}
