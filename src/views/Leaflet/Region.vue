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


import initMap from '@/base-ui/leaflet/initMap'
import createControl from '@/base-ui/leaflet/createControl'
import createOutLine from '@/base-ui/leaflet/createOutLine'


const ZHJSON = require('@/assets/json/ZH.json')
const guangdongshengJSON = require('@/assets/json/guangdongsheng.json')
const guangzhoushiJSON = require('@/assets/json/guangzhoushi.json')

let leafletMap = null
let leafletOutLine = null
export default {
    name: 'Region',
    async mounted() {
        leafletMap = await initMap(this.leafletId)
        createControl(leafletMap, {layerName: '智图-默认图层'})

        leafletOutLine = await createOutLine(leafletMap, {path: guangdongshengJSON.data, setView: true})

        this.$notify.success({
            title: '成功',
            message: '绘制经纬度区域轮廓',

        })
    },

    data() {
        return {
            leafletId: 'map',
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
        async toggle() {
            if (this.flag) {
                await leafletMap.removeLayer(leafletOutLine)
                this.flag = false
            } else {
                await leafletMap.addLayer(leafletOutLine)
                this.flag = true
            }
        },

        async changeArea(value) {
            await leafletMap.removeLayer(leafletOutLine)
            console.log('aaa')
            leafletOutLine = null

            if (value === '广东') {
                leafletOutLine = await createOutLine(leafletMap, {path: guangdongshengJSON.data})
            } else if (value === '广州') {
                leafletOutLine = await createOutLine(leafletMap, {path: guangzhoushiJSON.data})
            } else {
                leafletOutLine = await createOutLine(leafletMap, {path: ZHJSON.data})
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
