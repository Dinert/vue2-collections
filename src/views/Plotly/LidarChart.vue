<template>
    <div class="lidarChart">
        <div id="container"></div>
    </div>
</template>

<script>
import LaserRadar from '@/base-ui/plotly/radar'
const lidarJson = require('@/assets/json/radar.json')
export default {
    name: 'LidarChart',

    mounted() {
        this.laserRadar = new LaserRadar({
            data: lidarJson,
            container: '#container'
        })
    },
    data() {
        return {
            laserRadar: null
        }
    },
    computed: {

    },
    methods: {

    },

}
</script>

<style lang="scss" scoped>
.lidarChart {
    height: 100%;

    #container {
        &::v-deep {
            & > div {
                margin: 16px;
            }
        }
    }
}
</style>
