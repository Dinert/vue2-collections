import createControl from '@/base-ui/leaflet/createControl'

export default {
    data() {
        return {
            leafletConstrol: null
        }
    },
    methods: {
        async createControl(options = {layerName: '智图-默认图层'}) {
            this.leafletConstrol = await createControl(this.leafletMap, options)
        }
    }
}
