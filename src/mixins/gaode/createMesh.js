import createMesh from '@/base-ui/gaode/createMesh'

export default {
    data() {
        return {
            gaodeMesh: null
        }
    },
    methods: {
        async createMesh(options) {
            this.gaodeMesh = await createMesh(this.gaodeMap, {...options, setView: true})
        }
    }
}