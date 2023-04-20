<template>
    <section class="map">
        <div id="map"></div>
        <div class="map-search">

            <el-select v-model="areaName" placeholder="请选择轮廓的区域"
                @change="changeArea"
            >
                <el-option v-for="item in areaList" :key="item.value"
                    :label="item.label" :value="item.value"
                />
            </el-select>
            <el-button type="primary" @click="toggle">{{ flag ? '关闭轮廓' : '打开轮廓' }}</el-button>

        </div>
    </section>
</template>

<script>


import initMapMixins from '@/mixins/leaflet/initMap'
import createControlMixins from '@/mixins/leaflet/createControl'
import createOutLine from '@/mixins/leaflet/createOutLine'

const ZHJSON = require('@/assets/json/ZH.json')
const guangdongshengJSON = require('@/assets/json/guangdongsheng.json')
const guangzhoushiJSON = require('@/assets/json/guangzhoushi.json')

export default {
    name: 'Region',
    mixins: [initMapMixins, createControlMixins, createOutLine],
    async created() {
        await this.initMap()
        this.createControl()

        this.createOutLine({path: guangdongshengJSON.data})

        this.$notify.success({
            title: '成功',
            message: '绘制经纬度区域轮廓',
            duration: 0
        })
    },

    data() {
        return {
            region: null,
            areaName: '广东',
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
            flag: true
        }
    },
    methods: {
        toggle() {
            if (this.flag) {
                this.leafletMap.removeLayer(this.leafletOutLine)
                this.flag = false
            } else {
                this.leafletMap.addLayer(this.leafletOutLine)
                this.flag = true
            }
        },

        async changeArea(value) {
            this.leafletMap.removeLayer(this.leafletOutLine)
            this.leafletOutLine = null

            if (value === '广东') {
                this.createOutLine({path: guangdongshengJSON.data})
            } else if (value === '广州') {
                this.createOutLine({path: guangzhoushiJSON.data})
            } else {
                this.createOutLine({path: ZHJSON.data})
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.map {
    position: relative;
    width: 100%;
    height: 100%;

    #map {
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
</style>
