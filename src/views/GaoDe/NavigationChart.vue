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
    </section>
</template>

<script>
import initMapMixins from '@/mixins/gaode/initMap'
import createCylinderMixins from '@/mixins/gaode/createCylinder'
import createMeshMixins from '@/mixins/gaode/createMesh'
import createPointMixins from '@/mixins/gaode/createPoint'
import createCanvasLineMixins from '@/mixins/gaode/createCanvasLine'

const aerialVehiclesJSON =  require('@/assets/json/AerialVehicles.json')

export default {
    name: 'Region',
    mixins: [initMapMixins, createCylinderMixins, createMeshMixins, createPointMixins, createCanvasLineMixins],
    async mounted() {
        await this.initMap({
            viewMode: '3D',
        }, {
            plugins: ["Map3D", "AMap.DistrictSearch", "AMap.DistrictLayer"],
            version: '1.4.15',
            Loca: {
                version: '1.3.2'
            }
        })

        this.createCylinder({
            path: aerialVehiclesJSON,
            type: 'AQI',
            style: {
                radius: 100
            },
            pitch: 60
        })

        this.createMesh({
            path: aerialVehiclesJSON,
            type: 'AQI',
        })

        this.createPoint({
            path: aerialVehiclesJSON,
            type: 'AQI',
        })

        this.createCanvasLine({
            path: aerialVehiclesJSON,
            type: 'AQI',
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

        reset() {
            this.flagCylinder= true
            this.flagMesh= true
            this.flagPoint= true
            this.flagLine= true

            this.gaodeMap.setPitch(60);
            this.gaodeCylinder.setFitView()
            this.gaodeCylinder.show()
            this.gaodeMesh.show()
            this.gaodePoint.show()
            this.gaodeCanvasLine.show()
        },

        cylinderClick() {
            if(this.flagCylinder) {
                this.gaodeCylinder.hide()
                this.flagCylinder = false
            }else {
                this.gaodeCylinder.show()
                this.flagCylinder = true
            }
        },

        meshClick() {
            if(this.flagMesh) {
                this.gaodeMesh.hide()
                this.flagMesh = false
            }else {
                this.gaodeMesh.show()
                this.flagMesh = true
            }
        },

        pointClick() {
            if(this.flagPoint) {
                this.gaodePoint.hide()
                this.flagPoint = false
            }else {
                this.gaodePoint.show()
                this.flagPoint = true
            }
        },

        lineClick() {
            if(this.flagLine) {
                this.gaodeCanvasLine.hide()
                this.flagLine = false
            }else {
                this.gaodeCanvasLine.show()
                this.flagLine = true
            }
        }


    }
};
</script>

<style lang="scss" scoped>
.map {
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
        right: 0;
        left: 0;
        margin: 0 auto;
        text-align: center;
    }
}

</style>
