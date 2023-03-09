<template>
    <div class="complexChart">
        <div class="complexChart-item">
            <pie1 :chart-data="pieChartData1" :options="pieOptions1"/>
        </div>
    </div>
</template>

<script>
// import {DEchart} from '@dinert/echarts'

import {pieOptions1, pieChartData1} from '@/base-ui/echarts/pie/pie1'
import Pie1 from '@/components/PieComplexChart/pie1.vue'

export default {
    name: 'PieComplexChart',
    components: {
        Pie1
    },
    created() {

    },
    mounted() {

    },
    data() {
        return {
            pieOptions1,
            pieChartData1,
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
