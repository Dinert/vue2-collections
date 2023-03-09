import createLine from '@/base-ui/leaflet/createLine'

export default {
    data() {
        return {
            leafletLine: null
        }
    },
    methods: {
        async createLine(options) {
            this.leafletLine = await createLine(this.leafletMap, {...options, setView: true})
        }
    }
}
