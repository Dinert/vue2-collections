<template>
    <section class="map">
        <div id="map"></div>
        <div class="map-search">
            <el-autocomplete v-model="name" placeholder="请输入区县级以上的区域名称"
                :fetch-suggestions="querySearch"
                @keyup.enter.native="search"
                @select="search"
            />
            <el-button type="primary" class="search"
                @click="search"
            >查询</el-button>
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
import createWall from '@/base-ui/gaode/createWall'

import districtSearch from '@/base-ui/gaode/districtSearch'

let gaodeMap = null
let gaodeWall = null
export default {
    name: 'AreaFace',
    async created() {
        gaodeMap = await initMap('map', {
            viewMode: '3D',
        }, {
            plugins: ['Map3D', 'AMap.DistrictSearch', 'AMap.DistrictLayer'],
            version: '1.4.15',
            Loca: {
                version: '1.3.2'
            }
        })

        this.search()

        this.$notify.success({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `<h3>功能说明：</h3>
                      <h4>1. 使用高德地图的API生成该区域的3D掩模</h4>
                      <h4>2. 支持生成县级以上的区域掩模</h4>
                    `,
            duration: 0
        })
    },

    data() {
        return {
            pathData: '',
            name: '北京',
            restaurants: [
                {
                    value: '广东省',
                    address: '广东省'
                },
                {
                    value: '广州市',
                    address: '广州市'
                },
                {
                    value: '河源市',
                    address: '河源市'
                }
            ]
        }
    },
    methods: {
        inputClick(value) {
            const styleName = 'amap://styles/' + value
            gaodeMap.setMapStyle(styleName)
        },

        querySearch(queryString, cb) {
            const restaurants = this.restaurants
            const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants

            cb(results)
        },

        isRestaurants(name) {
            return this.restaurants.filter(item => {
                return item.value === name
            })
        },

        createFilter(queryString) {
            return restaurant => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
            }
        },

        search() {
            if (!this.name) {
                return this.$message({
                    type: 'error',
                    message: '请输入区县级以上的区域名称'
                })
            }

            return districtSearch({
                mask: [this.name]
            }).then(async res => {

                if (this.isRestaurants(this.name).length === 0) {
                    this.restaurants.push({
                        value: this.name,
                        address: this.name
                    })
                }

                this.$message({
                    type: 'success',
                    message: '渲染' + this.name + '的区域成功'
                })

                gaodeWall && gaodeMap.remove(gaodeWall)
                gaodeWall = await createWall(gaodeMap, {
                    path: res.bounds,
                    cityName: res.content.name,
                    pitch: 50,
                })

                gaodeMap.setMask(res.mask)

            }).catch(() => {
                this.$message({
                    type: 'error',
                    message: '渲染' + this.name + '失败'
                })
            })
        },

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
            width: 260px;

            &::v-deep {
                .el-input__inner {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
            }
        }

        .el-button.search {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
}
</style>
