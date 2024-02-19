<template>
    <section class="windy">
        <div id="windy"></div>
        <div class="windy-search">
            <el-select v-model="areaName" placeholder="请选择风场的区域"
                @change="changeArea"
            >
                <el-option v-for="item in areaList" :key="item.name"
                    :label="item.label" :value="item.value"
                />
            </el-select>
            <el-button type="primary" @click="toggleWind">{{ windy && windy.windyFlag ? '关闭风场' : '打开风场' }}</el-button>

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
const windJson = require('@/assets/json/wind.json')

let windy = null
export default {
    name: 'Windy',
    async mounted() {

        const map = await initMap(this.leafletId)
        createControl(map, {layerName: '智图-默认图层-暗蓝色'})
        windy = await this.initWindy(map)

        this.$notify.success({
            title: '成功',
            message: '这是一个实时的风场，可选择区域进行渲染！'
        })
    },
    data() {
        return {
            leafletId: 'windy',
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
            windyFlag: true,
            windy: null
        }
    },
    methods: {
        initWindy(map, data) {
            return new Promise(resolve => {
                const windy = L.tileLayer.windy({
                    windData: windJson,
                    windyOutLineData: data || ZHJSON.data,
                    map,
                    windyFlag: this.windyFlag,
                    windId: 'wind', // 这是唯一的
                }).init()
                resolve(windy)
            })

        },

        toggleWind() {
            if (this.windyFlag) {
                this.windyFlag = false
                windy.windyFlag = this.windyFlag
                windy.closeWind()
            } else {
                this.windyFlag = true
                windy.windyFlag = this.windyFlag
                windy.startWind()
            }
        },

        async changeArea(value) {
            this.windyFlag = false
            windy.windyFlag = this.windyFlag
            await windy.closeWind()
            if (value === '广东') {
                windy.windy.changeWindyOutLineData(guangdongshengJSON.data)
            } else if (value === '广州') {
                windy.windy.changeWindyOutLineData(guangzhoushiJSON.data)
            } else {
                windy.windy.changeWindyOutLineData(ZHJSON.data)
            }

            this.windyFlag = true
            windy.windyFlag = this.windyFlag
            await windy.startWind()
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
