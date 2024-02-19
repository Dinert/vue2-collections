<template>
    <section class="map">
        <div id="map"></div>
        <div class="map-search">
            <el-button type="primary" @click="reset">重置</el-button>
            <el-button :type="flagCylinder ? 'primary' : 'default'" @click="cylinderClick">柱状走航图</el-button>
            <el-button :type="flagMesh ? 'primary' : 'default'" @click="meshClick">面走航图</el-button>
            <el-button :type="flagPoint ? 'primary' : 'default'" @click="pointClick">点走航图</el-button>
            <el-button :type="flagLine ? 'primary' : 'default'" @click="lineClick">渐变线走航图</el-button>
        </div>

        <div class="input-card" style="width: 13rem;">
            <h4>官方默认自定义样式</h4>
            <div id="map-styles">
                <div class="input-item">
                    <input type="radio" name="mapStyle"
                        checked
                        value="normal"
                        @change="inputClick('normal')"
                    >
                    <span>标准</span>
                    <span class="input-text">normal</span>
                </div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="dark"
                    @change="inputClick('dark')"
                ><span>幻影黑</span><span class="input-text">dark</span></div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="light"
                    @change="inputClick('light')"
                ><span>月光银</span><span class="input-text">light</span></div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="whitesmoke"
                    @change="inputClick('whitesmoke')"
                ><span>远山黛</span><span class="input-text">whitesmoke</span></div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="fresh"
                    @change="inputClick('fresh')"
                ><span>草色青</span><span class="input-text">fresh</span></div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="grey"
                    @change="inputClick('grey')"
                ><span>雅士灰</span><span class="input-text">grey</span></div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="graffiti"
                    @change="inputClick('graffiti')"
                ><span>涂鸦</span><span class="input-text">graffiti</span></div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="macaron"
                    @change="inputClick('macaron')"
                ><span>马卡龙</span><span class="input-text">macaron</span></div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="blue"
                    @change="inputClick('blue')"
                ><span>靛青蓝</span><span class="input-text">blue</span></div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="darkblue"
                    @change="inputClick('darkblue')"
                ><span>极夜蓝</span><span class="input-text">darkblue</span></div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="wine"
                    @change="inputClick('wine')"
                ><span>酱籽</span><span class="input-text">wine</span></div>
            </div>
        </div>
    </section>
</template>

<script>
import initMap from '@/base-ui/gaode/initMap'
import createCylinder from '@/base-ui/gaode/createCylinder'
import createMesh from '@/base-ui/gaode/createMesh'
import createPoint from '@/base-ui/gaode/createPoint'
import createCanvasLine from '@/base-ui/gaode/createCanvasLine'


const aerialVehiclesJSON = require('@/assets/json/AerialVehicles.json')

let gaodeMap = null
let gaodeCylinder = null
let gaodeMesh = null
let gaodePoint = null
let gaodeCanvasLine = null
export default {
    name: 'Region',
    async mounted() {
        gaodeMap = await initMap('map', {
            viewMode: '3D',
        }, {
            plugins: ['Map3D', 'AMap.DistrictSearch', 'AMap.DistrictLayer'],
            version: '1.4.15',
            Loca: {
                version: '1.3.2'
            }
        })

        gaodeCylinder = await createCylinder(gaodeMap, {
            path: aerialVehiclesJSON,
            type: 'AQI',
            style: {
                radius: 100
            },
            pitch: 60, setView: true
        })
        gaodeMesh = await createMesh(gaodeMap, {
            path: aerialVehiclesJSON,
            type: 'AQI', setView: true
        })

        gaodePoint = await createPoint(gaodeMap, {
            path: aerialVehiclesJSON,
            type: 'AQI',
            setView: true
        })

        gaodeCanvasLine = await createCanvasLine(gaodeMap, {
            path: aerialVehiclesJSON,
            type: 'AQI',
            setView: true
        })

        this.$notify.success({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `    <h3>功能说明：</h3>
    <h4>1. 根据走航车的行驶路线的经纬度，带有污染物常规六参数AQI、PM2.5、PM10、SO2、NO2、CO生成不同类型的走航图</h4>
    <h4>2. 柱状走航图：根据污染物的浓度大小，生成不同高度不同颜色的3D柱形图</h4>
    <h4>3. 面走航图：根据污染物的浓度大小，生成不同高度的3D面积图，前后的污染物浓度使用颜色差值渲染展示</h4>
    <h4>4. 线走航图：根据污染物的浓度大小，差值颜色渲染成渐变路线图</h4>
    <h4>5. 点走航图：根据污染物的浓度大小，生成不同颜色的点位图</h4>`,
        })

    },

    data() {
        return {
            flagCylinder: true,
            flagMesh: true,
            flagPoint: true,
            flagLine: true
        }
    },
    methods: {
        inputClick(value) {
            const styleName = 'amap://styles/' + value
            this.gaodeMap.setMapStyle(styleName)
        },

        reset() {
            this.flagCylinder = true
            this.flagMesh = true
            this.flagPoint = true
            this.flagLine = true

            gaodeMap.setPitch(60)
            gaodeCylinder.setFitView()
            gaodeCylinder.show()
            gaodeMesh.show()
            gaodePoint.show()
            gaodeCanvasLine.show()
        },

        cylinderClick() {
            if (this.flagCylinder) {
                gaodeCylinder.hide()
                this.flagCylinder = false
            } else {
                gaodeCylinder.show()
                this.flagCylinder = true
            }
        },

        meshClick() {
            if (this.flagMesh) {
                gaodeMesh.hide()
                this.flagMesh = false
            } else {
                gaodeMesh.show()
                this.flagMesh = true
            }
        },

        pointClick() {
            if (this.flagPoint) {
                gaodePoint.hide()
                this.flagPoint = false
            } else {
                gaodePoint.show()
                this.flagPoint = true
            }
        },

        lineClick() {
            if (this.flagLine) {
                gaodeCanvasLine.hide()
                this.flagLine = false
            } else {
                gaodeCanvasLine.show()
                this.flagLine = true
            }
        }


    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/gaode.scss";

.map {
    position: relative;
    width: 100%;
    height: 100%;

    #map {
        z-index: 0;
        width: 100%;
        height: 100%;

        &::v-deep {
            .cylinderInfo {
                padding: 4px;
                width: 200px;
                border: 1px solid #e5e5e5;
                border-radius: 4px;
                background-color: rgb(255 255 255 / .8);

                p {
                    margin: 6px 0;
                }
            }

            .custom-content-marker {
                position: relative;
                width: 25px;
                height: 200px;
                background-color: rgb(255 255 255 / .8);
            }

            .custom-content-marker img {
                width: 100%;
                height: 100%;
            }

            .custom-content-marker .close-btn {
                position: absolute;
                top: -6px;
                right: -8px;
                display: none;
                width: 15px;
                height: 15px;
                font-size: 12px;
                border-radius: 50%;
                text-align: center;
                color: #fff;
                background: #ccc;
                box-shadow: -1px 1px 1px rgb(10 10 10 / .2);
                line-height: 15px;
            }

            .custom-content-marker .close-btn:hover {
                background: #666;
            }
        }
    }

    &-search {
        position: absolute;
        top: 30px;
        left: 50%;
        text-align: center;
        transform: translate(-50%);
    }
}

</style>
