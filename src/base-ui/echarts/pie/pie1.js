import _ from 'lodash'

const pieCenter = ['50%', '50%']

export const pieOptions1 = {
    title: {
        text: '人才国籍分布',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    grid: {
        containLabel: false
    },
    _autoDownPlay: 3000,
    legend: {
        show: false
    },
    series: [
        // 外圈
        {
            type: 'pie',
            radius: ['60%', '75%'],
            center: pieCenter,
            color: ['#0083EB', '#5F5F61', '#B6DB5A', '#38BAFE', '#40DFEB', '#61E5BB'],
            minAngle: 1,
            data: []
        },
        // 内圈
        {
            type: 'pie',
            radius: ['45%', '60%'],
            center: pieCenter,
            color: ['#0083EB', '#5F5F61', '#B6DB5A', '#38BAFE', '#40DFEB', '#61E5BB'],
            label: {
                show: false
            },
            minAngle: 1,
            data: []
        },
        // 外边框
        {
            type: 'pie',
            clockWise: false, // 顺时加载
            hoverAnimation: false, // 鼠标移入变大
            center: pieCenter,
            radius: ['77%', '77%'],
            tooltip: {
                show: false
            },
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            data: [{
                value: 0,
                name: '',
                itemStyle: {
                    normal: {
                        borderWidth: 5,
                        borderColor: '#184b8c',
                        opacity: 0.58
                    }
                }
            }]
        },
        // 底渐变色
        {
            radius: ['0%', '45%'],
            center: pieCenter,
            type: 'pie',
            animation: false,
            hoverAnimation: false, // 鼠标移入变大
            tooltip: {
                show: false
            },
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    borderColor: '#184b8c',
                    opacity: 0.58,
                    color: {
                        type: 'radial', // 径向渐变
                        x: 0.5, // 圆心坐标（中心）
                        y: 0.5,
                        r: 1, // 半径长度
                        colorStops: [
                            {
                                offset: 0,
                                color: '#1C3B86' // offset：坐标为0处的颜色
                            }, {
                                offset: 1,
                                color: '#12254F' // offset：坐标为1处的颜色
                            },
                        ],
                    }
                }
            },
            data: [0]
        }
    ],
    configCallback: options => {
        const newOptions = _.cloneDeep(options)

        const rem = document
            .getElementsByTagName('html')[0]
            .style.fontSize.replace('px', '')
        const series = newOptions.series
        const data = series[0].data

        newOptions.series[0].label = {
            position: 'center',
            color: '#FFFFFF',
            rich: {
                total: {
                    fontSize: 1.6 * rem,
                    lineHeight: 2.8 * rem,
                    marginTop: rem,
                    fontFamily: 'Bebas,sans-serif',
                },
            },
            lineHeight: 1.2 * rem
        }
        // 计算人才总数
        newOptions.series[0].label.formatter = () => {
            let values = 0
            data.forEach(item => {
                if (item.value) {
                    values += item.value
                }
            })
            return `人才总数\r\n{total|${values}}`
        }

        newOptions.series[1].data = _.cloneDeep(data).map(item => {
            item.itemStyle = {
                opacity: 0.4
            }
            return item
        })

        return newOptions
    }
}

export const pieChartData1 = {
    "series": [
      {
        "data": [
          {
            "name": "中国",
            "value": 1837
          },
          {
            "name": "英国",
            "value": 192
          },
          {
            "name": "日本",
            "value": 162
          },
          {
            "name": "美国",
            "value": 151
          },
          {
            "name": "韩国",
            "value": 131
          },
          {
            "name": "上海",
            "value": 1
          },
          {
            "name": "其他",
            "value": 142
          }
        ],
        "type": "pie"
      }
    ],
    "tooltip": {
      "trigger": "item"
    }
  }