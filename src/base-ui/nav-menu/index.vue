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
                    "appName":"leaflet地图",
                    "caption":"leaflet地图",
                    icon: 'el-icon-ice-cream-square',
                    "id":10001,
                    "subMenuItems":[
                        {
                            "appName":"地图风格",
                            "caption":"地图风格",
                            icon: 'el-icon-wind-power',
                            "id":10003,
                            "subMenuItems":[],
                            "url":"/leaflet/mapstyle"
                        },
                        {
                            "appName":"风场",
                            "caption":"风场",
                            icon: 'el-icon-wind-power',
                            "id":10002,
                            "subMenuItems":[],
                            "url":"/leaflet/windy"
                        },
                        {
                            "appName":"渲染",
                            "caption":"渲染",
                            icon: 'el-icon-wind-power',
                            "id":10004,
                            "subMenuItems":[],
                            "url":"/leaflet/render"
                        }
                    ],
                    "url":"/leaflet"
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
