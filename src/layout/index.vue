<template>
    <div class="layout">
        <div v-if="getWindowWidth1000 && !getNavMenuCollapse" class="layout-bg"
            @click="SET_NAVMENUCOLLAPSE(!getNavMenuCollapse)"
        ></div>

        <div v-if="getHeaderShow" class="layout-top">
            <h1 class="layout-top-text" style="margin: 0;">一个炫酷的演示平台</h1>
        </div>

        <div class="layout-body" :class="{headerShow: getHeaderShow}">
            <div class="layout-body-menu" :collapse="getNavMenuCollapse"
                :class="{'hideMenu': getWindowWidth1000}"
            >
                <div v-if="getNavMenuLogo" class="layout-body-menu-title">
                    <img class="layout-body-menu-title-logo" src="https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png">
                    <h1 v-if="!getNavMenuCollapse" class="layout-body-menu-title-text text-dot">Vue2-elementUi</h1>
                </div>
                <nav-menu/>
            </div>
            <div class="layout-body-right" :style="{width: `calc(100% - ${getWindowWidth1000 ? '0px' : getNavMenuCollapse ? '64px' : '260px'})`}">
                <div class="layout-body-right-header">
                    <span class="layout-body-right-header-menu" :collapse="getNavMenuCollapse"
                        @click="changeCollapse(getNavMenuCollapse)"
                    >
                        <i :class="getNavMenuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
                    </span>
                    <el-breadcrumb class="layout-body-right-header-breadcrumb" separator="/">
                        <el-breadcrumb-item :to="{path: '/'}">{{ '首页' }}</el-breadcrumb-item>
                        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                    </el-breadcrumb>

                    <ul class="layout-body-right-header-operations">
                        <li v-if="!getWindowWidth1000" class="layout-body-right-header-operations-item">
                            <screen-full/>
                        </li>
                        <li v-if="!getWindowWidth1000" class="layout-body-right-header-operations-item">
                            <size-select/>
                        </li>
                        <li class="layout-body-right-header-operations-item layout-body-right-header-operations-user" style="margin-right: 16px;">
                            <avatar/>
                        </li>
                    </ul>
                </div>
                <header-tabs v-if="getHeaderTabs" class="layout-body-right-tabs"/>
                <div class="layout-body-right-main" :class="{isOverflow}">
                    <transition mode="out-in" name="fade"
                        @before-enter="BeforeEnter"
                        @after-enter="afterEnter"
                        @before-leave="beforeLeave"
                        @after-leave="afterLeave"
                    >
                        <router-view v-slot="{Component, route}">
                            <component :is="Component" :key="route.path"
                                :class="route.path"
                            />
                        </router-view>
                    </transition>

                </div>
            </div>
        </div>
        <setting/>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
    name: 'Layout',
    components: {
        NavMenu: () => import('@/base-ui/nav-menu'),
        ScreenFull: () => import('@/base-ui/screen-full'),
        SizeSelect: () => import('@/base-ui/size-select'),
        Avatar: () => import('@/base-ui/avatar'),
        Setting: () => import('@/base-ui/setting'),
        HeaderTabs: () => import('@/base-ui/header-tabs')
    },
    beforeMount() {
        const offset = this.getWindowOffset()

        // 获取浏览器的宽高
        this.SET_WINDOWOFFSET(offset)

        if (offset.width < 1024) {
            this.SET_NAVMENUCOLLAPSE(true)
        } else {
            this.SET_NAVMENUCOLLAPSE(false)
        }

        if (offset.width < 1000) {
            this.SET_WINDOWWIDTH1000(true)
        } else {
            this.SET_WINDOWWIDTH1000(false)
        }

        this.$resize = () => {
            const offset = this.getWindowOffset()

            this.SET_WINDOWOFFSET(offset)

            if (offset.width < 1024) {
                this.SET_NAVMENUCOLLAPSE(true)
                this.SET_WINDOWWIDTH1024(true)
            } else {
                this.SET_WINDOWWIDTH1024(false)
            }

            if (offset.width < 1000) {
                this.SET_WINDOWWIDTH1000(true)
            } else {
                this.SET_WINDOWWIDTH1000(false)
            }
        }
        window.addEventListener('resize', this.$resize, false)
    },
    beforeDestroy() {


        window.removeEventListener('resize', this.$resize)
    },
    data() {
        return {
            menuData: [],
            isOverflow: true,
        }
    },
    computed: {
        ...mapGetters(['getNavMenuCollapse', 'getWindowWidth1000', 'getNavMenuLogo', 'getHeaderTabs', 'getHeaderShow'])
    },
    methods: {
        ...mapMutations(['SET_NAVMENUCOLLAPSE', 'SET_WINDOWOFFSET', 'SET_WINDOWWIDTH1024', 'SET_WINDOWWIDTH1000']),
        changeCollapse(navMenuCollapse) {
            navMenuCollapse = !navMenuCollapse
            this.SET_NAVMENUCOLLAPSE(navMenuCollapse)
        },
        getWindowOffset() {
            return {
                width: document.documentElement.clientWidth || document.body.clientWidth,
                height: document.documentElement.clientHeight || document.body.clientHeight
            }
        },
        BeforeEnter() {
            this.isOverflow = false
        },
        afterEnter() {
            this.isOverflow = true
        },
        beforeLeave() {
            this.isOverflow = false
        },
        afterLeave() {
            this.isOverflow = true
        },
    },
}
</script>

<style lang="scss" scoped>
.fade-leave-active {
    transition: $--animate-default;
}

.fade-enter-active {
    opacity: 0;
    transition: $--animate-default;
    transform: translateX(-50px);
}

.fade-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.layout {
    height: 100%;

    &-bg {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        background-color: rgba($--color-black, .5);
    }

    &-top {
        padding-left: 30px;
        height: 50px;
        font-weight: bolder;
        background-color: $--color-primary;
        line-height: 50px;

        &-text {
            font-size: 20px;
            color: #fff;
        }
    }

    &-body {
        display: flex;
        height: 100%;

        &.headerShow {
            height: calc(100% - 50px);
        }

        &-menu {
            display: flex;
            width: $--width-menu;
            height: 100%;
            background-color: $--color-bg-menu;
            transition: $--animate-default;
            flex: 0 0 $--width-menu;
            flex-direction: column;

            &[collapse] {
                flex: 0 0 $--width-menu-collapse;
                width: $--width-menu-collapse;

                .layout-menu-content {
                    :deep(.el-menu-item-name) {
                        display: none;
                    }

                    :deep(.el-submenu__icon-arrow) {
                        display: none;
                    }
                }
            }

            &[collapse].hideMenu {
                position: fixed;
                left: -$--width-menu-collapse;
                z-index: 2;
            }

            &.hideMenu {
                position: fixed;
                left: 0;
                z-index: 2;
            }

            &-title {
                height: 50px;
                line-height: 50px;
                text-align: center;

                &-logo {
                    width: 32px;
                    height: 32px;
                    vertical-align: middle;
                }

                &-text {
                    display: inline-block;
                    margin: 0;
                    margin-left: 12px;
                    font-size: 14px;
                    color: $--color-white;
                    vertical-align: middle;
                }
            }

            &-content {
                width: 100%;
                transition: $--animate-default;
            }
        }

        &-right {
            display: flex;
            height: 100%;
            flex-direction: column;

            &-header {
                height: 50px;
                line-height: 50px;
                box-shadow: $--box-shaodw-header;

                &-menu {
                    display: inline-block;
                    padding: 0 16px;
                    height: 100%;
                    font-size: 22px;
                    cursor: pointer;

                    &:hover {
                        background-color: rgba($--color-black, .025);
                    }

                    i {
                        color: rgba($--color-black, .7);
                    }
                }

                &-breadcrumb {
                    display: inline-block;
                }

                &-operations {
                    float: right;
                    height: 100%;

                    &::after {
                        content: "";
                        display: block;
                        clear: both;
                    }

                    &-item {
                        float: left;
                        height: 100%;
                        font-size: 18px;
                        color: $--color-icon;
                        cursor: pointer;

                        &:hover {
                            background-color: rgba($--color-black, .025);
                        }
                    }
                }
            }

            &-tabs {
                height: 34px;
                border-bottom: 1px solid #d8dce5;
                box-shadow: 0 1px 3px 0 rgba($--color-black, .12), 0 0 3px 0 rgba($--color-black, .04);
            }

            &-main {
                position: relative;
                z-index: 0;
                overflow: hidden;
                padding: 16px;
                height: 0;
                flex: 1;

                &.isOverflow {
                    overflow: auto;
                }

                & > div {
                    min-height: 300px;
                }
            }
        }
    }
}
</style>
