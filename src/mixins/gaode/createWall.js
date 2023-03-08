import createWall from '@/base-ui/gaode/createWall'

export default {
    data() {
        return {
            gaodeWall: null
        }
    },
    methods: {
        async createWall(options) {
            this.gaodeWall = await createWall(this.gaodeMap, options)
        }
    }
}