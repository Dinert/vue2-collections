<template>
    <el-menu
        :collapse="getNavMenuCollapse"
        mode="vertical"
        :collapse-transition="false"
        :default-active="currentUrl"
        class="scroll layout-menu-content"
        :unique-opened="true"
    >
        <nav-menu-sub-menu v-for="menu in menuDatas" :key="menu.id"
            :sub-menu-items="menu"
        />
    </el-menu>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    name: 'NavMenu',
    components: {
        NavMenuSubMenu: () => import('./nav-menu-sub-menu.vue')
    },
    data() {
        return {
            url: ''
        }
    },
    computed: {
        ...mapGetters(['menuDatas', 'getNavMenuCollapse']),
        currentUrl() {
            return this.$route.path
        },
        menuDatas() {
            let menuData = [
                {
                    'appName': 'leaflet地图',
                    'caption': 'leaflet地图',
                    icon: 'leaflet',
                    'id': 10001,
                    'subMenuItems': [
                        {
                            'appName': '地图风格',
                            'caption': '地图风格',
                            icon: 'style',
                            'id': 10003,
                            'subMenuItems': [],
                            'url': '/leaflet/mapstyle'
                        },
                        {
                            'appName': '风场',
                            'caption': '风场',
                            icon: 'wind',
                            'id': 10002,
                            'subMenuItems': [],
                            'url': '/leaflet/windy'
                        },
                        {
                            'appName': '渲染',
                            'caption': '渲染',
                            icon: 'render',
                            'id': 10004,
                            'subMenuItems': [],
                            'url': '/leaflet/render'
                        },
                        {
                            'appName': '图片渲染',
                            'caption': '图片渲染',
                            icon: 'render',
                            'id': 10008,
                            'subMenuItems': [],
                            'url': '/leaflet/renderImage'
                        },
                        {
                            'appName': '区域',
                            'caption': '区域',
                            icon: 'area',
                            'id': 10005,
                            'subMenuItems': [],
                            'url': '/leaflet/region'
                        },
                        {
                            'appName': '路线',
                            'caption': '路线',
                            icon: 'line',
                            'id': 10007,
                            'subMenuItems': [],
                            'url': '/leaflet/line'
                        }
                    ],
                    'url': '/leaflet'
                },
                {
                    'appName': '高德地图',
                    'caption': '高德地图',
                    icon: 'gaode',
                    'id': 20001,
                    subMenuItems: [
                        {
                            'appName': '走航图',
                            'caption': '走航图',
                            icon: 'navigationChart',
                            'id': 20001,
                            'subMenuItems': [],
                            'url': '/gaode/navigationChart'
                        },
                        {
                            'appName': '下载区域经纬度',
                            'caption': '下载区域经纬度',
                            icon: 'download',
                            'id': 20002,
                            'subMenuItems': [],
                            'url': '/gaode/getLnglat'
                        },
                        {
                            'appName': '区域面',
                            'caption': '区域面',
                            icon: 'area',
                            'id': 20003,
                            'subMenuItems': [],
                            'url': '/gaode/areaFace'
                        },
                        {
                            'appName': '路径规划',
                            'caption': '路径规划',
                            icon: 'line',
                            'id': 20004,
                            'subMenuItems': [],
                            'url': '/gaode/pathQuery'
                        }
                    ],
                    'url': '/gaode'
                },
                {
                    'appName': 'Echarts',
                    'caption': 'Echarts',
                    icon: 'echarts',
                    id: 30001,
                    subMenuItems: [
                        {
                            'appName': '后向轨迹',
                            'caption': '后向轨迹',
                            icon: 'backTrajectory',
                            'id': 30002,
                            'subMenuItems': [],
                            'url': '/echarts/backTrajectory'
                        },
                        {
                            'appName': '复杂条形图图表',
                            'caption': '复杂条形图图表',
                            icon: 'complexChart',
                            'id': 30003,
                            'subMenuItems': [],
                            'url': '/echarts/barComplexChart'
                        },
                        {
                            'appName': '复杂饼图图表',
                            'caption': '复杂饼图图表',
                            icon: 'complexChart',
                            'id': 30004,
                            'subMenuItems': [],
                            'url': '/echarts/pieComplexChart'
                        },
                    ],
                    url: 'echarts'
                },
                {
                    'appName': 'plotly.js',
                    'caption': 'plotly.js',
                    icon: 'plotly',
                    'url': '/plotly',
                    'id': 40003,
                    subMenuItems: [
                        {
                            'appName': '激光雷达图',
                            'caption': '激光雷达图',
                            'id': 40001,
                            icon: '',
                            'url': '/plotly/lidarChart'
                        },
                        {
                            'appName': '粒径谱图',
                            'caption': '粒径谱图',
                            'id': 40002,
                            icon: '',
                            'url': '/plotly/grain'
                        }
                    ]
                },
                {
                    'appName': 'element-ui',
                    'caption': 'element-ui',
                    icon: 'element-ui',
                    'url': '/elementUI',
                    'id': 40005,
                    subMenuItems: [
                        {
                            'appName': '自适应表格',
                            'caption': '自适应高度表格',
                            'url': '/elementUI/table'
                        },
                        {
                            'appName': '表单',
                            'caption': '表单',
                            'url': '/elementUI/form'
                        }
                    ]
                }
            ]
            const filterId = [] // 过滤个人中心
            menuData = menuData.filter(v => !filterId.includes(v.id))
            return menuData
        }
    }
}
</script>

<style lang="scss" scoped>
.layout-menu-content {
    overflow-y: auto;
    height: 100%;
    border-right: none;
    background-color: $--color-bg-menu;

    :deep() {
        .el-menu {
            background-color: $--color-bg-menu;
        }

        .el-submenu__title {
            color: $--color-text-menu;

            &:hover {
                background-color: rgba($--color-primary, 10%);
            }

            &:focus {
                background-color: unset;
            }

            i {
                margin-right: 8px;
                color: $--color-text-menu;
            }
        }

        .el-menu-item {
            border-left: 2px solid transparent;
            color: $--color-text-menu;

            &.is-active {
                background-image: linear-gradient(90deg, #1b2443, #1c2646);
                border-image: linear-gradient(0deg, rgba($--color-primary, .9), rgba($--color-primary, .5)) 0 2;
                color: $--color-primary;

                i {
                    color: $--color-primary;
                }
            }

            &:focus {
                background-color: unset;
            }

            &:hover {
                background-color: rgba($--color-primary, 10%);
            }

            /* stylelint-disable-next-line no-descending-specificity */
            i {
                margin-right: 8px;
                color: $--color-text-menu;
            }
        }
    }
}
</style>
