<template>
    <div class="backTrajectory">
        <div id="map"></div>
    </div>
</template>

<script>

import BackWardTrack from '@/base-ui/echarts/backTrajectory'
import {loadBMap} from '@/base-ui/echarts/loadBMap'
const backTrajectoryJSON =  require('@/assets/json/backTrajectory.json')
import {resize} from '@/utils/tools'


export default {
    name: 'BackTrajectory',

    mounted() {
        loadBMap('Srbp3butMqqcIU8TeoYNd2F2kOmqqzTH').then(() => {
            this.backWardTrack = new BackWardTrack({
                container: "map",
                data: backTrajectoryJSON,
                stationName: '后向轨迹'
            }).init();
        })

        resize(this.resize, 100)

    },
    data() {
        return {
            backWardTrack: null
        }
    },
    computed: {

    },
    methods: {
        resize() {
            this.backWardTrack && this.backWardTrack.chart && this.backWardTrack.chart.isDisposed &&  this.backWardTrack.chart.resize();
        }
    },
    beforeDestroy() {
        this.backWardTrack.chart.dispose()
        this.backWardTrack.chart = null
    }

}
</script>

<style lang="scss" scoped>
.backTrajectory {
    width: 100%;
    height: 100%;

    #map {
        width: 100%;
        height: 100%;
    }
}
</style>