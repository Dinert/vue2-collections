import _ from 'lodash'
import {wFormatInt} from '@/utils/tools'
import * as echarts from 'echarts'

export const barOptions3 = {
    tooltip: {
        backgroundColor: 'rgba(20,43,80,0.89)',
        borderColor: 'transparent',
        textStyle: {
            color: '#FFF'
        },
        axisPointer: {
            type: 'shadow'
        },
        formatter: params => {
            let templete = ''
            templete += '<div class="text-left">' + params[0].axisValueLabel + '</div>'
            for (let i = 0; i < 2; i++) {
                const item = params[i]
                const bgColor = typeof item.color === 'string' ? item.color
                    : item.color.colorStops[item.color.colorStops.length - 1].color
                item.marker = item.marker.replace(
                    'background-color:[object Object];',
                    `background-color:${bgColor};`
                )
                if (item.seriesType === 'line') {
                    templete += '<div class="text-left">' + item.seriesName + ': ' + item.data + '%' + '</div>'
                } else {
                    templete += '<div class="text-left">' + item.seriesName + ': ' + wFormatInt(item.data) + '</div>'
                }
            }
            return templete
        }
    },
    title: {
        text: '条形图3',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    _isGradualColors: true,
    _autoTooltip: 3000,
    grid: {
        bottom: '40em',
        left: '16em',
        right: '16em',
        top: '15%',
        containLabel: true
    },
    yAxis: [
        {
            nameTextStyle: {
                color: 'transparent'
            },
            axisTick: 'none',
            axisLine: {show: true, lineStyle: {color: '#18417F'}},
            axisLabel: {
                textStyle: {
                    color: '#fff'
                },
            },
            splitLine: false,
            interval: 10000,
        },
        {
            type: 'value',
            splitLine: false,
            nameTextStyle: {
                color: 'transparent'
            },
            splitNumber: 1.5,
            axisTick: 'none',
            axisLabel: {
                textStyle: {
                    color: '#fff'
                },
                formatter: '{value} %'
            }
        }
    ],
    xAxis: [{
        axisTick: 'none',
        axisLine: {show: true, lineStyle: {color: '#18417F'}},
        axisLabel: {
            textStyle: {
                color: '#fff'
            },
        },
        offset: 10
    }],
    legend: {
        itemHeight: 6,
        itemWidth: 6,
        pageTextStyle: {color: '#B1B9C4', width: 20},
        textStyle: {color: '#fff', fontSize: 12},
        type: 'scroll',
        bottom: 0
    },
    // eslint-disable-next-line max-statements
    configCallback: options => {
        const rem = document.getElementsByTagName('html')[0].style.fontSize.replace('px', '')

        options.legend.textStyle.fontSize = rem
        options.legend.itemHeight = rem
        options.legend.itemWidth = rem
        options.xAxis[0].axisLabel.textStyle.fontSize = rem

        const yAxis = options.yAxis
        for (let i = 0; i < yAxis.length; i++) {
            yAxis[i].axisLabel.textStyle.fontSize = rem
        }

        const series = options.series
        let barData = []

        let max = null
        const maxData = []
        const barWidth = 1.8 * rem
        const barHeight = rem
        const barHeight2 = 0.6 * rem
        const bottomData = []
        for (let i = 0; i < series.length; i++) {
            const serie = series[i]
            if (serie.type === 'line') {
                serie.lineStyle = {
                    color: '#EBCD51',
                    shadowBlur: 1,
                    shadowColor: 'rgba(0,10,10,0.3)',
                    shadowOffsetY: 5
                }
                serie.smooth = true
                serie.showSymbol = false
                serie.yAxisIndex = i
                serie.z = 20
            } else {
                serie.barWidth = barWidth
                serie.barGap = '-100%'
                serie.itemStyle = {
                    color: function () {
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#3CB7F4' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#1486EF'// 100% 处的颜色
                        }], false)
                    }
                }
                barData = serie.data
            }
        }
        max = _.max(barData)
        for (let i = 0; i < barData.length; i++) {
            maxData.push(max + max)
            bottomData.push(1)
        }

        // 头部
        series.push({
            'name': '',
            'type': 'pictorialBar',
            'symbolSize': [barWidth, barHeight],
            'symbolOffset': [0, -barHeight2],
            'z': 12,
            'symbolPosition': 'end',
            itemStyle: {
                color: '#5DD8F7',
                opacity: 1,
            },
            'data': barData
        },)

        // 底下的圆片
        series.push({
            'name': '',
            'type': 'pictorialBar',
            'symbolSize': [barWidth, barHeight],
            'symbolOffset': [0, barHeight2],
            'z': 12,
            itemStyle: {
                opacity: 1,
                color: '#1866BA'
            },
            'data': bottomData
        })

        // 背景色
        series.push({
            name: '',
            type: 'bar',
            barWidth: barWidth,
            barGap: '-100%',
            z: 0,
            itemStyle: {
                color: '#0E4F82',
                opacity: 0.55,
            },
            data: maxData
        })

        // 背景色顶部
        series.push({
            'name': '', // 头部
            'type': 'pictorialBar',
            'symbolSize': [barWidth, barHeight],
            'symbolOffset': [0, -(barHeight2)],
            'z': 12,
            'symbolPosition': 'end',
            itemStyle: {
                color: '#163F7A',
                opacity: 1,
            },
            'data': maxData
        },)

        return options
    },
}


export const barChartData3 = {
    "yAxis": [
      {
        "name": "数据1",
        "type": "value"
      },
      {
        "name": "数据2",
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
        "数据1",
        "数据2"
      ]
    },
    "series": [
      {
        "data": [
          7876,
          12011,
          18814,
          23042,
          26244
        ],
        "name": "数据1",
        "type": "bar"
      },
      {
        "data": [
          0,
          52.5,
          56.64,
          22.47,
          13.9
        ],
        "name": "数据2",
        "type": "line"
      }
    ],
    "tooltip": {
      "trigger": "axis"
    },
    "title": {
    }
  }