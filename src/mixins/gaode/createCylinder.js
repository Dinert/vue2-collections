import createCylinder from '@/base-ui/gaode/createCylinder'

export default {
    data() {
        return {
            gaodeCylinder: null
        }
    },
    methods: {
        async createCylinder(options) {
            this.gaodeCylinder = await createCylinder(this.gaodeMap, {...options, setView: true})
        }
    }
}
