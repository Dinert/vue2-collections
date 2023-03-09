import createCanvasLine from '@/base-ui/gaode/createCanvasLine'

export default {
    data() {
        return {
            gaodeCanvasLine: null
        }
    },
    methods: {
        async createCanvasLine(options) {
            this.gaodeCanvasLine = await createCanvasLine(this.gaodeMap, {...options, setView: true})
        }
    }
}
