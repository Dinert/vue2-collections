import createPoint from '@/base-ui/gaode/createPoint'

export default {
    data() {
        return {
            gaodePoint: null
        }
    },
    methods: {
        async createPoint(options) {
            this.gaodePoint = await createPoint(this.gaodeMap, {...options, setView: true})
        }
    }
}
