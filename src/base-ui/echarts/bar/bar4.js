import _ from 'lodash'
import * as echarts from 'echarts'

export const barOptions4 = {
    title: {
        text: '条形图4',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    grid: {
        bottom: '0%',
        left: '5%',
        right: '5%',
        top: '15%',
    },
    yAxis: [
        {
            type: 'category',
            axisLine: 'none',
            show: true,
            inverse: true,
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    verticalAlign: 'bottom',
                    align: 'left',
                    padding: [0, 10, 10, 10],
                    fontSize: 20
                },
            }
        },
        {
            type: 'category',
            inverse: true,
            splitLine: 'none',
            axisTick: 'none',
            axisLine: 'none',
            axisLabel: {
                textStyle: {
                    color: '#FFFF00',
                    fontSize: 16,
                    verticalAlign: 'bottom',
                    align: 'right',
                    padding: [0, 10, 10, 0]
                }
            }
        }
    ],
    xAxis: [
        {
            type: 'value',
            show: false,
            axisLine: {
                lineStyle: {
                    color: '#364f9a'
                }
            }
        }
    ],
    legend: {
        show: false
    },
    series: [
        {
            name: '浏览量',
            stack: 'chart',
            barWidth: 8,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: '#365581',
                borderRadius: 50
            },
            itemStyle: {
                color: '#56D0A4',
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        {
                            offset: 0,
                            color: '#1468FF'
                        },
                        {
                            offset: 1,
                            color: '#51AFF5'
                        }
                    ]),
                    barBorderRadius: 50
                }
            }
        }
    ],
    tooltip: {
        backgroundColor: 'rgba(20,43,80,0.89)',
        borderColor: 'transparent',
        textStyle: {
            color: '#FFF',
        },
        axisPointer: {
            type: 'shadow'
        },
        // trigger: 'axis',
        formatter: params => {
            let templete = ''
            templete += '<div class="text-left">' + params[0].axisValueLabel + '</div>'
            for (let i = 0; i < 1; i++) {
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
                    templete += '<div class="text-left">' + item.seriesName + ': ' + item.data + '</div>'
                }
            }
            return templete
        }
    },
    configCallback: options => {

        const rem = document
            .getElementsByTagName('html')[0].style.fontSize.replace('px', '')

        // 原始数据
        const seriesData = options.series[0].data

        options.series[0].barWidth = rem

        // 百分比数据
        const percentData = []

        // 等差数据
        const isochronousData = [0]
        let currNum = 0

        if (seriesData) {
            // 总数
            const sum = _.sum(seriesData)

            // 算出百分比数据
            seriesData.forEach(item => {
                const value = (item / sum * 100).toFixed(2)
                percentData.push(Number(value))
            })

            // 算出等差数据
            percentData.forEach((item, index) => {
                if (index === 0) {
                    isochronousData.push(percentData[index])
                } else {
                    if (currNum) {
                        currNum = percentData[index] + currNum
                    } else {
                        currNum = percentData[index] + percentData[index - 1]
                    }
                    isochronousData.push(Number(currNum.toFixed(2)))
                }
            })
            options.series[0].data = isochronousData
        }


        // 数据1
        options.yAxis[0].axisLabel.textStyle.fontSize = rem
        options.yAxis[0].axisLabel.textStyle.padding = [0, 1 * rem, 1 * rem, 10]
        options.yAxis[1].axisLabel.textStyle.padding = [0, 1 * rem, 1 * rem, 0]
        options.yAxis[0].data = options.xAxis[0].data
        options.xAxis[0].type = 'value'
        options.series[0].itemStyle.normal.color = 'transparent'
        options.series[0].stack = 'Total'

        // 数据2
        options.series[1] = _.cloneDeep(options.series[0])
        options.series[1].yAxisIndex = 1
        options.series[1].itemStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
                offset: 0,
                color: '#1468FF'
            },
            {
                offset: 1,
                color: '#51AFF5'
            }
        ])
        options.series[1].data = percentData

        // 显示的数据
        options.yAxis[1].data = seriesData
        options.yAxis[1].axisLabel.rich = {
            value: {
                fontSize: rem
            },
            precenter: {
                fontSize: rem,
                color: '#fff'
            }
        }
        options.yAxis[1].axisLabel.formatter = function (value, index) {
            const html = `{value|${value}}{precenter|家 (${percentData[index]}%)}`
            return html
        }

        // 取消tooltip
        options.tooltip.show = false

        return options
    }
}

export const barChartData4 = {
    'xAxis': [
        {
            'data': [
                '数据1',
                '数据2',
                '数据3',
                '数据4',
                '数据5',
                '数据6'
            ],
            'type': 'category'
        }
    ],
    'series': [
        {
            'data': [
                1085,
                871,
                729,
                421,
                371,
                207
            ],
            'name': '行业',
            'type': 'bar'
        }
    ],
    'tooltip': {
        'show': true,
        'trigger': 'axis'
    }
}
