import _ from 'lodash'
import * as echarts from 'echarts'

export const barOptions1 = {
    title: {
        text: '条形图',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    _isGradualColors: true,
    _autoTooltip: 3000,
    tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(20,43,80,0.89)',
        borderColor: 'transparent',
        textStyle: {
            color: '#FFF'
        },
        axisPointer: {
            type: 'shadow'
        },
        formatter: params => {
            const value = params[0]
            const template = `<div>${value.axisValueLabel}</div>
                             <div>${value.seriesName}：${value.value}</div>`
            return template
        }
    },
    xAxis: [{}],
    grid: {
        bottom: '16em',
        left: '16em',
        right: '25em',
        top: '25em',
        containLabel: true
    },
    legend: {
        show: false
    },
    series: [{
        show: true,
        type: 'bar',
        barWidth: '20%',
        z: 5,
        label: {
            show: false,
        },
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                    offset: 0,
                    color: '#0195E9' // 0% 处的颜色
                }, {
                    offset: 1,
                    color: '#01C0F6' // 100% 处的颜色
                }], false),
                barBorderRadius: [20, 20],
            }
        },
    }],
    configCallback(options) {
        const rem = document.getElementsByTagName('html')[0].style.fontSize.replace('px', '')


        const data = options.series[0].data
        const tempdata = []
        const max = _.max(options.series[0].data)
        options.yAxis = [
            {
                data: options.xAxis[0].data,
                type: 'category',
                show: true,
                inverse: true,
                axisTick: { // y轴刻度线
                    show: false
                },
                axisLabel: {
                    formatter: '{value}',
                    color: '#fff',
                    fontSize: rem
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
            },
            {
                type: 'category',
                name: '',
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                    fontSize: rem
                },
                axisLine: {
                    show: false
                },
                inverse: true,
                data: options.xAxis[0].data
            }
        ]
        if (data) {
            for (let i = 0; i < data.length; i++) {
                tempdata.push(max)
            }
        }
        options.series[1] = {
            silent: true,
            type: 'bar',
            barWidth: '20%',
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#144776',
                    barBorderRadius: [20, 20],
                }
            },
            data: tempdata
        }
        options.xAxis = [
            {
                splitLine: false,
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                    fontSize: rem
                },
                max: function (value) {
                    return value.max
                }
            }
        ]

        return options
    }
}

export const barChartData1 = {
    "yAxis": [
      {
        "name": "数据量",
        "type": "value"
      },
      {
        "name": "同比增长率",
        "type": "value"
      }
    ],
    "xAxis": [
      {
        "data": [
          "2018",
          "2019",
          "2020",
          "2021",
          "2022"
        ],
        "type": "category"
      }
    ],
    "legend": {
      "data": [
        "数据量",
        "同比增长率"
      ]
    },
    "series": [
      {
        "data": [
          7386,
          12919,
          18882,
          23089,
          26751
        ],
        "name": "数据量",
        "type": "bar"
      },
      {
        "data": [
          0,
          74.91,
          46.16,
          22.28,
          15.86
        ],
        "name": "同比增长率",
        "type": "line"
      }
    ],
    "tooltip": {
      "trigger": "axis"
    }
  }