import _ from 'lodash'
import {wFormatInt} from '@/utils/tools'
import * as echarts from 'echarts'

export const barOptions2 = {
    title: {
        text: '条形图2',
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
                              <div>${value.seriesName}：${wFormatInt(value.value)}</div>`
            return template
        }
    },
    grid: {
        bottom: '-20em',
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
        barWidth: '25%',
        z: 5,
        label: {
            show: false,
        },
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                    offset: 0,
                    color: '#2BA4B5' // 0% 处的颜色
                }, {
                    offset: 1,
                    color: '#0DE7E5' // 100% 处的颜色
                }], false),
                barBorderRadius: [25, 25],
            }
        },
    }],
    configCallback(options) {
        const rem = document.getElementsByTagName('html')[0].style.fontSize.replace('px', '')
        const data = options.series[0].data
        const tempdata = []
        const opticalData = []
        const headData = []
        const endData = []
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
                    fontSize: rem,
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
            },
            {

                triggerEvent: true,
                show: true,
                inverse: true,
                axisTick: { // y轴刻度线
                    show: false
                },
                data: data,
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    align: 'left',
                    verticalAlign: 'center',
                    color: '#F4F72C',
                    fontSize: rem,
                    borderRadius: [9, 9, 9, 9],
                    backgroundColor: '#1A2F71',
                    padding: [2, 4],
                    fontWeight: 400,
                    formatter(value) {
                        return wFormatInt(value)
                    }
                }

            }
        ]
        if (data) {
            for (let i = 0; i < data.length; i++) {
                tempdata.push(max + (max * 0.1))
                const minValue = max / 10 > data[i] ? max / 11 : data[i]
                opticalData.push({value: minValue, symbolPosition: 'end'})

                endData.push({value: max + (max * 0.1), symbolPosition: 'end'})
                headData.push(1)
            }
        }

        // 背部数据
        options.series[1] = {
            silent: true,
            type: 'bar',
            barWidth: '25%',
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#144776',
                    barBorderRadius: [3.8 * rem, 3.8 * rem],
                }
            },
            data: tempdata
        }

        // 中间光点
        options.series.push(
            {
                name: 'XXX',
                type: 'pictorialBar',
                symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAZlBMVEUAAABe3uVe3+Vf3uVf3+Zf3uVg3+Zg3+Zf3+Vi4OZh4OZg3+Z86/Bh3+Zi4Odj4Odi4OZ86/B76/B86/Bj4ed56+9x5+xn4umB7/N87PB36e+A7/N+7fF/7vJ/7vJ+7fGA7/OB7/PReX+lAAAAIXRSTlMABQkVDREmIhk3MR10LEFFPHh7cUprXE35h2XnqMLAp+mHAG9cAAAB5ElEQVRIx83WjU7CMBQFYIoiKMqU/XUboHv/l/Tce7t2XamDNSacETEmX86tlK2rx4py150o+MstMBLwWRfHKo6JCVxLnvmFGBjFQ58oF1//sUZhGy/ClSTWObgnL4O+bkeN4nY2okfNMbkRt9/vtxz8InoTsWplJSCzFxPmO8+GpSIByX3YQAuGDWtRKhKjCnxDXhF6Z4yxnZ20Wgko7BMRDmxtSGVaI4kdTIgb+zTYoJQlIMlDlmUFgrcDWWC201qSayqlTkiCddWWeV62VU0YlnpRi9VOKaSUsiyq/N0krwq2Ugt7lVpZl5BfHNiytjagMi+XYp0kCR45hMlivVQrE/uU5pXSrCB5bM6d1t2lOZItMqmliT3q5uVxqxzyW/ccfYLNKx7ZTeykMvNyac2yt2Fbc61MHLSC0rwoxbiNdlQ3GBm1NLHQsHUrtEXppR/ljNpW6DbSCoqlFiVoN6YdaFlgsSFVPs1BdT8OaB5QyQzVcaqWDows/zepxR8ObLglTrdtCRVuRNj4Rrxh+//0ke2f8KVL+Kon3GCSbmsJN9OUW3j6g0Ns+LgCij2u0h+Sghc8mlMPBMgdx5DFh59VmOVHrvmDnoNxCz3J7MFWsMuaLyR089xz/xhlfijvwutR8gv3zk6BLUUeCgAAAABJRU5ErkJggg==',
                symbolSize: [5.2 * rem, 5.2 * rem],
                symbolOffset: [2 * rem, 0],
                z: 12,
                itemStyle: {
                    normal: {
                        color: '#fff'
                    }
                },
                data: opticalData
            }
        )


        options.xAxis = [
            {
                splitLine: false,
                show: false,
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                    },
                },

                max: function (value) {
                    return value.max + (value.max * 0.1)
                }
            }
        ]
        return options
    },

}


export const barChartData2 = {
    "yAxis": [
      {
        "name": "数据",
        "type": "value"
      }
    ],
    "xAxis": [
      {
        "data": [
          '2022-8',
          "2022-9",
          "2022-10",
          "2022-11",
          "2022-12",
        ],
        "type": "category"
      }
    ],
    "legend": {
      "data": [
        "数据"
      ]
    },
    "series": [
      {
        "data": [
          1128,
          1145,
          277,
          333,
          111,
        ],
        "name": "数据",
        "type": "bar"
      }
    ],
    "tooltip": {
      "trigger": "axis"
    }
  }