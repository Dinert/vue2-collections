<template>
    <div class="complexChart">
        <div class="complexChart-item">
            <d-echart :chart-data="barChartData1" :options="barOptions1"/>
        </div>
        <div class="complexChart-item">
            <d-echart :chart-data="barChartData2" :options="barOptions2"/>
        </div>
        <div class="complexChart-item">
            <d-echart :chart-data="barChartData3" :options="barOptions3"/>
        </div>
        <div class="complexChart-item">
            <d-echart :chart-data="barChartData4" :options="barOptions4"/>
        </div>
    </div>
</template>

<script>
import {DEchart} from '@dinert/echarts'

import {barOptions1, barChartData1} from '@/base-ui/echarts/bar/bar1'
import {barOptions2, barChartData2} from '@/base-ui/echarts/bar/bar2'
import {barOptions3, barChartData3} from '@/base-ui/echarts/bar/bar3'
import {barOptions4, barChartData4} from '@/base-ui/echarts/bar/bar4'

export default {
    name: 'BarComplexChart',
    components: {
        DEchart
    },
    created() {

    },
    mounted() {

    },
    data() {
        return {
            barOptions1,
            barChartData1,
            barOptions2,
            barChartData2,
            barOptions3,
            barChartData3,
            barOptions4,
            barChartData4,
        }
    },

}
</script>

<style lang="scss" scoped>
.complexChart {
    display: flex;
    flex-wrap: wrap;

    &-item {
        margin: 1rem 1rem 0 0;
        padding: 1rem;
        width: 30rem;
        height: 20rem;
        border-radius: 4px;
        background-color: #01083d;
        flex: 0 0 30rem;
    }
}
</style>