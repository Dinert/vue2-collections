<template>
    <div class="backTrajectory">
        <div id="map"></div>
    </div>
</template>

<script>

import BackWardTrack from '@/base-ui/echarts/backTrajectory'
import {loadBMap} from '@/base-ui/echarts/loadBMap'
const backTrajectoryJSON =  require('@/assets/json/backTrajectory.json')
import _ from 'lodash'


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

        window.addEventListener('resize', this.resize, false)

    },
    data() {
        return {
            backWardTrack: null
        }
    },
    computed: {

    },
    methods: {
        resize: _.debounce(function () {
            this.backWardTrack && this.backWardTrack.chart && this.backWardTrack.chart.isDisposed &&  this.backWardTrack.chart.resize();
        }, 100)
    },
    destroyed() {
        window.removeEventListener('resize', this.resize, false)
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