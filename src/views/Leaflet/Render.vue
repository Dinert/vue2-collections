<template>
    <section class="windy">
        <div id="windy"></div>
        <div class="windy-search">
            <el-select v-model="areaName" placeholder="请选择渲染的区域"
                @change="changeArea"
            >
                <el-option v-for="item in areaList" :key="item.name"
                    :label="item.label" :value="item.value"
                />
            </el-select>
            <el-button type="primary" @click="toggleWind">{{ windy && windy.overlayFlag ? '关闭渲染' : '打开渲染' }}</el-button>

        </div>
    </section>
</template>

<script>

import leafletMixins from '@/mixins/leaflet/initMap'
import addControlMixins from '@/mixins/leaflet/addControl'

import '/public/assets/js/leaflet.Windy.js'

const ZHJSON =  require('@/assets/json/ZH.json')
const guangdongshengJSON =  require('@/assets/json/guangdongsheng.json')
const guangzhoushiJSON =  require('@/assets/json/guangzhoushi.json')
const renderJson =  require('@/assets/json/render.json')

export default {
    name: 'Render',
    mixins: [leafletMixins, addControlMixins],
    async created() {
        await this.initMap()
        await this.addControl({
            layerName: '智图-默认图层-暗蓝色'
        })
        await this.initWindy()

    },
    data() {
        return {
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
            leafletMap: {
                id: 'windy',
                options: {

                }
            },
            windy: null
        }
    },
    methods: {
        initWindy(data) {
            this.windy = L.tileLayer.windy({
                type: "AQI",
                overlayData: renderJson,
                verlayOutLineData: data || ZHJSON.data,
                map: this.leafletMap.map,
                overlayFlag: this.overlayFlag,
            }).init();
        },

        toggleWind() {
            if(this.overlayFlag) {
                this.overlayFlag = false
                this.windy.overlayFlag = this.overlayFlag
                this.windy.closeOverlay()
            }else {
                this.overlayFlag = true
                this.windy.overlayFlag = this.overlayFlag
                this.windy.openOverlay()
            }
        },

        async changeArea(value) {
            this.overlayFlag = false
            this.windy.overlayFlag = this.overlayFlag
            await this.windy.closeOverlay()
            if(value === '广东') {
                this.windy.windy.changeVerlayOutLineData(guangdongshengJSON.data)
            }else if(value === '广州') {
                this.windy.windy.changeVerlayOutLineData(guangzhoushiJSON.data)
            }else {
                this.windy.windy.changeVerlayOutLineData(ZHJSON.data)
            }

            this.overlayFlag = true
            this.windy.overlayFlag = this.overlayFlag
            await this.windy.openOverlay()
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