
import * as echarts from 'echarts'


const names = [
    '数据1',
    '数据2',
    '数据3',
    '数据4',
    '数据5'
]

const values = [63980, 53980, 43980, 26240, 23320]
const max = Math.max(...values)

export const barOptions5 = {
    title: {
        text: '条形图5',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    grid: {
        bottom: '0%',
        left: '5%',
        right: '1%',
        top: '15%',
    },

    xAxis: {
        type: 'value',
        show: false
    },
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
            const template = `<div>条形图</div>
                             <div>${params.name}：${values[params.dataIndex]}</div>`
            return template
        }
    },
    yAxis: {
        type: 'category',
        inverse: true,
        show: false,
        data: names,
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {
            color: '#cfe3ff',
            fontSize: 14
        }
    },

    series: [


        // 背景条
        {
            type: 'bar',
            data: new Array(values.length).fill(max),
            barWidth: 10,
            silent: true,
            itemStyle: {
                color: 'rgba(255,255,255,0.08)',
            },
            barGap: '-100%'
        },

        // 主条
        {
            type: 'bar',
            data: values,
            barWidth: 10,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {offset: 0, color: '#2f7bff'},
                    {offset: 1, color: '#27e3c3'}
                ])
            }
        },
        // 👉 专门用于显示左侧
        {
            type: 'bar',
            data: new Array(values.length).fill(max),
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
                color: 'transparent'
            },
            label: {
                show: true,
                position: [0, '-200%'],
                distance: 10,
                color: '#fff',
                fontSize: 14,
                formatter: v => {
                    return names[v.dataIndex]
                }
            }
        },
        // 👉 专门用于显示右侧数值
        {
            type: 'bar',
            data: new Array(values.length).fill(max),
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
                color: 'transparent'
            },
            label: {
                show: true,
                position: ['84%', '-200%'],
                distance: 0,
                color: '#fff',
                fontSize: 14,
                formatter: v => {
                    return values[v.dataIndex].toLocaleString() + '元'
                }
            }
        }
    ],
    configCallback: options => {

        const rem = document
            .getElementsByTagName('html')[0].style.fontSize.replace('px', '')

        options.series.forEach(item => {
            item.label && (item.label.fontSize = rem * 1)
            item.barWidth = rem * 0.8
        })

        return options
    }
}
