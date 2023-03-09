<template>
    <div class="left-center">
        <div class="left-center-content">
            <d-echart :options="options" :chart-data="chartData"
                class="left-centent-content-echart"
                @auto-downplay-callback="autoDownplayCallback"
            />
            <div class="left-center-content-legend">
                <div v-for="(item, index) in data" :key="item.name"
                    :class="['left-center-content-legend-item', {active: highIndex === index}]"
                >
                    <span
                        class="left-center-content-legend-item-circle"
                        :style="`background-color:${colors[index]}`"
                    ></span>
                    <p class="left-center-content-legend-item-name">{{ item.name }}</p>
                    <p class="left-center-content-legend-item-value">
                        <span class="value">{{ item.value }}</span>
                        <span class="precent">({{ precents[index] }})</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {DEchart} from '@dinert/echarts'
import _ from 'lodash'

export default {
    name: 'left-center',
    props: {
        options: {
            type: Object,
            default: () => ({})
        },
        chartData: {
            type: Object,
            default: () => ({})
        },
    },
    components: {
        DEchart
    },
    data() {
        return {
            highIndex: 0,
            colors: [
                '#0083EB',
                '#5F5F61',
                '#B6DB5A',
                '#38BAFE',
                '#40DFEB',
                '#61E5BB',
                '#E690D1',
                '#e7bcf3',
                '#9d96f5',
                '#8378EA',
                '#96BFFF'
            ]
        }
    },
    computed: {
        title() {
            return this.options.title && this.options.title.text
        },
        precents() {
            const result = []
            if (this.data) {
                const sum = _.sumBy(this.data, 'value')
                for (let i = 0; i < this.data.length; i++) {
                    const value = this.data[i].value
                    if (value) {
                        const precent = (value / sum * 100).toFixed(2) + '%'
                        result.push(precent)
                    }
                }
            }
            return result
        },

        data() {
            return this.chartData && this.chartData.series && this.chartData.series[0].data
        }
    },
    methods: {
        autoDownplayCallback(chart, index) {
            this.highIndex = index
        }
    }

}
</script>

<style lang="scss" scoped>
.left-center {
    height: 100%;
    background-size: 100% 100%;
    // background-image: url("~@/assets/images/full/new/box1.png");

    .left-center-title {
        padding-left: 3rem;
        height: 5.8rem;
        font-size: 2rem;
        font-weight: bold;
        text-align: left;
        color: #fff;
        line-height: 5.8rem;
    }

    .left-center-content {
        display: flex;
        align-items: center;
        height: 100%;

        .left-centent-content-echart {
            margin-right: 1rem;
            width: 50%;
        }

        .left-center-content-legend {
            .left-center-content-legend-item {
                font-size: 1rem;
                color: #fff;

                &.active {
                    background-color: rgba($color: #fff, $alpha: .2);
                }

                &:last-child {
                    margin-bottom: 0;
                }

                .left-center-content-legend-item-circle {
                    display: inline-block;
                    margin-right: 1rem;
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                }

                .left-center-content-legend-item-name {
                    display: inline-block;
                    margin: 0 2rem 0 0;
                }

                .left-center-content-legend-item-value {
                    display: inline-block;
                    margin: .8rem 0;

                    .precent {
                        margin-left: .5rem;
                        color: #ff3;
                    }
                }
            }
        }
    }
}
</style>
