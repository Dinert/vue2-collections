import createOutLine from '@/base-ui/leaflet/createOutLine'

export default {
    data() {
        return {
            leafletOutLine: null
        }
    },
    methods: {
        async createOutLine(options) {
            this.leafletOutLine = await createOutLine(this.leafletMap, {...options, setView: true})
        }
    }
}
