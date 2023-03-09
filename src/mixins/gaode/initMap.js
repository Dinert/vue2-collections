import initMap from '@/base-ui/gaode/initMap'

export default {
    data() {
        return {
            gaodeMap: null,
            gaodeId: 'map'
        }
    },
    methods: {
        async initMap(options, loadOptions) {
            this.gaodeMap = await initMap(this.gaodeId, options, loadOptions)
        },
    }

}
