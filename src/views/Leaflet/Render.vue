<template>
    <section class="windy">
        <div id="windy"></div>
        <div class="windy-search">
            <el-select v-model="airParams" @change="changeParams">
                <el-option v-for="item in params" :key="item.value"
                    :label="item.label" :value="item.value"
                />
            </el-select>

            <el-select v-model="areaName" placeholder="请选择渲染的区域"
                @change="changeArea"
            >
                <el-option v-for="item in areaList" :key="item.value"
                    :label="item.label" :value="item.value"
                />
            </el-select>
            <el-button type="primary" @click="toggleWind">{{ overlayFlag ? '关闭渲染' : '打开渲染' }}</el-button>

        </div>
    </section>
</template>

<script>
import L from 'leaflet'

import initMap from '@/base-ui/leaflet/initMap'
import createControl from '@/base-ui/leaflet/createControl'

import '/public/assets/js/leaflet.Windy.js'

const ZHJSON = require('@/assets/json/ZH.json')
const guangdongshengJSON = require('@/assets/json/guangdongsheng.json')
const guangzhoushiJSON = require('@/assets/json/guangzhoushi.json')
const renderJson = require('@/assets/json/render.json')

let windy = null

export default {
    name: 'Render',
    async mounted() {
        const map = await initMap(this.leafletId)
        createControl(map, {layerName: '智图-默认图层'})

        await this.initWindy(map)

        this.$notify.success({
            title: '成功',
            message: '空气质量的渲染差值图，根据不同污染物的等级渲染不同的颜色！限定区域进行渲染',

        })

    },
    data() {
        return {
            airParams: 'AQI',
            areaList: [
                {
                    label: '中国',
                    value: '中国'
                },
                {
                    label: '广东',
                    value: '广东'
                },
                {
                    label: '广州',
                    value: '广州'
                }
            ],
            areaName: '中国',
            overlayFlag: true,
            leafletId: 'windy',

            params: [
                {
                    value: 'AQI',
                    label: 'AQI'
                },
                {
                    value: 'O3',
                    label: 'O3'
                },
                {
                    value: 'PM2.5',
                    label: 'PM2.5'
                },
                {
                    value: 'CO',
                    label: 'CO'
                },
                {
                    value: 'PM10',
                    label: 'PM10'
                },
                {
                    value: 'SO2',
                    label: 'SO2'
                },
                {
                    value: 'NO2',
                    label: 'NO2'
                },
                {
                    value: 'cwt',
                    label: 'cwt'
                },
                {
                    value: 'pscf',
                    label: 'pscf'
                },
                {
                    value: 'wind',
                    label: 'wind'
                }
            ],
            windy: null
        }
    },
    methods: {
        initWindy(map, data) {

            return new Promise(resolve => {
                windy = L.tileLayer.windy({
                    type: this.airParams,
                    overlayData: renderJson,
                    verlayOutLineData: data || ZHJSON.data,
                    map,
                    overlayFlag: this.overlayFlag,
                }).init()
                resolve(windy)
            })
        },

        toggleWind() {
            if (this.overlayFlag) {
                this.overlayFlag = false
                windy.overlayFlag = this.overlayFlag
                windy.closeOverlay()
            } else {
                this.overlayFlag = true
                windy.overlayFlag = this.overlayFlag
                windy.openOverlay()
            }
        },

        async changeArea(value) {
            this.overlayFlag = false
            windy.overlayFlag = this.overlayFlag
            await windy.closeOverlay()
            if (value === '广东') {
                windy.windy.changeVerlayOutLineData(guangdongshengJSON.data)
            } else if (value === '广州') {
                windy.windy.changeVerlayOutLineData(guangzhoushiJSON.data)
            } else {
                windy.windy.changeVerlayOutLineData(ZHJSON.data)
            }

            this.overlayFlag = true
            windy.overlayFlag = this.overlayFlag
            await windy.openOverlay()
        },

        changeParams(value) {
            windy.type = value
            this.changeArea(this.areaName)
        }
    },

}
</script>

<style lang="scss" scoped>
.windy {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;

    #windy {
        z-index: 0;
        width: 100%;
        height: 100%;
    }

    &-search {
        position: absolute;
        top: 30px;
        left: 50%;
        text-align: center;
        transform: translate(-50%);

        .el-select {
            &::v-deep {
                .el-input__inner {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
            }
        }

        .el-button {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
}

</style>
