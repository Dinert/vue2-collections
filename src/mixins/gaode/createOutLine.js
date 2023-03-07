import createOutLine from '@/base-ui/gaode/createOutLine'

export default {
    data() {
        return {
            gaodeOutLine: null
        }
    },
    methods: {
        async createOutLine(options) {
            this.gaodeOutLine = await createOutLine(this.gaodeMap, {...options, setView: true})
        }
    }
}