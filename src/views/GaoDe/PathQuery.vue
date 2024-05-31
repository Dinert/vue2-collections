<template>
    <section class="map">
        <div id="panel"></div>
        <div id="map"></div>
        <div class="map-search">
            <span>开始地点：</span><el-input v-model="lngLatsText[0]" size="small"/>
            <span>结束地点：</span><el-input v-model="lngLatsText[1]" size="small"/>
            <div>
                <el-button type="primary" size="small"
                    icon="el-icon-search" @click="searchFn()"
                >查询</el-button>
            </div>

        </div>
        <div v-if="false" class="input-card"
            style="width: 13rem;"
        >
            <h4>官方默认自定义样式</h4>
            <div id="map-styles">
                <div class="input-item">
                    <input type="radio" name="mapStyle"
                        value="normal"
                        @change="inputClick('normal')"
                    >
                    <span>标准</span>
                    <span class="input-text">normal</span>
                </div>
                <div class="input-item"><input type="radio" name="mapStyle"
                    value="dark"
                    checked
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

        <ul class="line-list">
            <li v-for="(item, key) in drivingMap" :key="key"
                @click="drivingShow(item, key.split('-'))"
            >
                <el-link type="primary">{{ key }}</el-link>
            </li>
        </ul>
    </section>
</template>

<script>


import initMap from '@/base-ui/gaode/initMap'

let gaodeMap = null
let geocoder = null
export default {
    name: 'Region',
    async mounted() {
        gaodeMap = await initMap('map', {
            viewMode: '3D',
            center: [116.397428, 39.90923], // 地图中心点
        }, {
            plugins: ['AMap.DistrictSearch', 'AMap.Driving', 'AMap.PlaceSearch', 'AMap.Geocoder'],
        })
        this.inputClick('dark')


        geocoder = new AMap.Geocoder({
            radius: 1000 // 范围，默认：500
        })


        gaodeMap.on('click', e => {

            if (this.index === 2) {
                this.index = 0
            }
            this.$set(this.lngLats, this.index, e.lnglat)
            this.index++
        })

        this.searchFn('广州', '深圳')
        this.searchFn('福建', '广州')

    },

    data() {
        return {
            index: 0,
            lngLats: [],
            lngLatsText: [],
            drivingMap: {}
        }
    },
    methods: {
        drivingShow(driving, text) {
            if (!driving.checked) {
                driving.clear()
            } else {
                driving.search([{keyword: text[0]}, {keyword: text[1]}])

            }
            driving.checked = !driving.checked
        },
        inputClick(value) {
            const styleName = 'amap://styles/' + value
            gaodeMap.setMapStyle(styleName)
        },
        searchFn(startText, endText) {

            const driving = new AMap.Driving({
                map: gaodeMap,
                ferry: 1,
                panel: 'panel'
            })
            if (startText && endText) {
                driving.search([{keyword: startText}, {keyword: endText}], (status, result) => {
                    const steps = result && result.routes && result.routes[0].steps
                    if (status === 'complete') {
                        console.log(steps, 'settttttttttttt')
                        // log.success('绘制驾车路线完成')
                    } else {
                        // log.error('获取驾车数据失败：' + result)
                    }
                })
                this.$set(this.drivingMap, startText + '-' + endText, driving)

            } else {
                driving.search((this.lngLats[0]), this.lngLats[1], (status, result) => {
                    this.lngLats = []

                    const steps = result && result.routes && result.routes[0].steps

                    if (status === 'complete') {
                        console.log(steps, 'settttttttttttt')
                        // log.success('绘制驾车路线完成')
                    } else {
                        // log.error('获取驾车数据失败：' + result)
                    }
                })
                this.$set(this.drivingMap, this.lngLatsText.join('-'), driving)

            }

        }
    },
    watch: {
        lngLats: {
            handler(newVal) {
                if (newVal[0]) {
                    geocoder.getAddress(newVal[0], (status, result) => {
                        if (status === 'complete') {
                            const address = result.regeocode.formattedAddress
                            this.$set(this.lngLatsText, 0, address)
                        }
                    })
                }
                if (newVal[1]) {
                    geocoder.getAddress(newVal[1], (status, result) => {
                        if (status === 'complete') {
                            const address = result.regeocode.formattedAddress
                            console.log(address, '12312')
                            this.$set(this.lngLatsText, 1, address)
                        }
                    })
                }


            },
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/gaode.scss";

#panel {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    overflow-y: auto;
    width: 280px;
    max-height: 50%;
    background-color: #fff;
}

#panel .amap-call {
    background-color: #009cf9;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

#panel .amap-lib-driving {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    overflow: hidden;
}

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
        display: flex;
        text-align: center;
        color: #fff;

        & > span {
            margin-left: 12px;
            width: 80;
        }

        .el-input {
            flex: 0 0 300px;
            width: 300px;
        }

        .el-button {
            margin-left: 12px;
        }
    }
}

.line-list {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 300px;
    height: 300px;
    border-radius: 4px;
    background-color: #fff;

    li {
        margin: 12px;
    }
}
</style>
