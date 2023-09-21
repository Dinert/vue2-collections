<template>
    <section class="map">
        <div id="map"></div>
        <div class="map-search">
            <el-button type="primary" @click="searchFn">查询</el-button>
        </div>
        <div class="input-card" style="width: 13rem;">
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
    </section>
</template>

<script>


import initMapMixins from '@/mixins/gaode/initMap'


export default {
    name: 'Region',
    mixins: [initMapMixins],
    async created() {
        await this.initMap({
            viewMode: '3D',
            center: [116.397428, 39.90923], // 地图中心点
        }, {
            plugins: ['AMap.DistrictSearch', 'AMap.Driving', 'AMap.PlaceSearch'],
        })
        this.inputClick('dark')


        this.driving = new AMap.Driving({
            map: this.gaodeMap,
            ferry: 1,
        })


        this.gaodeMap.on('click', e => {
            this.lngLats.push(e.lnglat)
        })

    },

    data() {
        return {
            lngLats: []
        }
    },
    methods: {
        inputClick(value) {
            const styleName = 'amap://styles/' + value
            this.gaodeMap.setMapStyle(styleName)
        },

        searchFn() {
            this.driving.search(this.lngLats[0], this.lngLats[1], (status, result) => {
                this.lngLats = []

                const steps = result.routes[0].steps

                if (status === 'complete') {
                    console.log(steps, 'settttttttttttt')
                // log.success('绘制驾车路线完成')
                } else {
                // log.error('获取驾车数据失败：' + result)
                }
            })
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
    }

    &-search {
        position: absolute;
        top: 30px;
        left: 50%;
        text-align: center;
        transform: translate(-50%);

        .el-autocomplete {
            width: auto;

            &::v-deep {
                .el-input__inner {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
            }
        }

        .el-button.download {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
}
</style>
