<template>
    <section class="map">
        <div id="map"></div>
        <div class="map-search">
            <el-autocomplete v-model="name" placeholder="请输入区县级以上的区域名称"
                :fetch-suggestions="querySearch"
                @keyup.enter.native="search"
                @select="search"
            />
            <el-button type="primary" class="download"
                @click="search"
            >查询</el-button>
            <el-button type="primary" @click="download">下载</el-button>
        </div>
    </section>
</template>

<script>


import initMapMixins from '@/mixins/gaode/initMap'
import districtSearch from '@/base-ui/gaode/districtSearch'
import createOutLineMixins from '@/mixins/gaode/createOutLine'

import { saveAs } from 'file-saver';

export default {
    name: 'Region',
    mixins: [initMapMixins, createOutLineMixins],
    async created() {
        await this.initMap({}, {
            plugins: ['AMap.DistrictSearch']
        })

    },

    data() {
        return {
            pathData: '',
            name: '',
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
        toggle() {
            if(this.flag) {
                this.leafletMap.removeLayer(this.leafletLine)
                this.flag = false
            }else {
                this.leafletMap.addLayer(this.leafletLine)
                this.flag = true
            }
        },

        querySearch(queryString, cb) {
            let restaurants = this.restaurants;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;

            cb(results);
        },

        isRestaurants(name) {
            return this.restaurants.filter(item => {
                return item.value === name
            })
        },

        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },

        search() {
            if(!this.name) {
                return this.$message({
                    type: 'error',
                    message: '请输入区县级以上的区域名称'
                })
            }

            districtSearch({
                mask: [this.name]
            }).then(res => {

                if(this.isRestaurants(this.name).length === 0) {
                    this.restaurants.push({
                        value: this.name,
                        address: this.name
                    })
                }

                this.$message({
                    type: 'success',
                    message: '查找' + this.name + '的区域数据成功'
                })

                this.gaodeOutLine && this.gaodeMap.remove(this.gaodeOutLine)
                this.createOutLine({
                    path: res.bounds
                })
                this.pathData = res

            }).catch(() => {
                this.$message({
                    type: 'error',
                    message: '查找' + this.name + '失败'
                })
            })
        },

        download() {
            const name = this.pathData.content.name
            const content = JSON.stringify({name: name, data: this.pathData.mask})
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" });

            saveAs(blob, name + ".json");

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
    }

    &-search {
        position: absolute;
        top: 30px;
        right: 0;
        left: 0;
        margin: 0 auto;
        text-align: center;

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
