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
import leafletMixins from '@/mixins/leaflet/initMap'
import createControlMixins from '@/mixins/leaflet/createControl'

import '/public/assets/js/leaflet.Windy.js'

const ZHJSON =  require('@/assets/json/ZH.json')
const guangdongshengJSON =  require('@/assets/json/guangdongsheng.json')
const guangzhoushiJSON =  require('@/assets/json/guangzhoushi.json')
const windJson =  require('@/assets/json/wind.json')

export default {
    name: 'Windy',
    mixins: [leafletMixins, createControlMixins],
    async created() {
        await this.initMap()
        await this.createControl({
            layerName: '智图-默认图层-暗蓝色'
        })
        await this.initWindy()

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
        initWindy(data) {
            this.windy = L.tileLayer.windy({
                windData: windJson,
                windyOutLineData: data || ZHJSON.data,
                map: this.leafletMap,
                windyFlag: this.windyFlag,
                windId: 'wind',   // 这是唯一的
            }).init();
        },

        toggleWind() {
            if(this.windyFlag) {
                this.windyFlag = false
                this.windy.windyFlag = this.windyFlag
                this.windy.closeWind()
            }else {
                this.windyFlag = true
                this.windy.windyFlag = this.windyFlag
                this.windy.startWind()
            }
        },

        async changeArea(value) {
            this.windyFlag = false
            this.windy.windyFlag = this.windyFlag
            await this.windy.closeWind()
            if(value === '广东') {
                this.windy.windy.changeWindyOutLineData(guangdongshengJSON.data)
            }else if(value === '广州') {
                this.windy.windy.changeWindyOutLineData(guangzhoushiJSON.data)
            }else {
                this.windy.windy.changeWindyOutLineData(ZHJSON.data)
            }

            this.windyFlag = true
            this.windy.windyFlag = this.windyFlag
            await this.windy.startWind()
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
        right: 0;
        left: 0;
        margin: 0 auto;
        width: 300px;

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