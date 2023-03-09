<template>
    <div class="setting">
        <div v-if="show" class="setting-bg"
            @click="show = false"
        ></div>
        <div class="setting-content" :class="{show}">
            <span class="setting-content-icon" @click="show = !show">
                <i class="el-icon-setting"></i>
            </span>

            <div class="setting-content-drawer">
                <div class="setting-content-drawer-title">系统布局配置</div>
                <div class="setting-content-drawer-body">
                    <div class="setting-content-drawer-body-item">
                        <span>主题色</span>
                        <span>
                            <theme-picker/>
                        </span>
                    </div>
                    <div class="setting-content-drawer-body-item">
                        <span>侧边栏Logo</span>
                        <span>
                            <el-switch :value="getNavMenuLogo" @change="changeLogo"/>
                        </span>
                    </div>
                    <div class="setting-content-drawer-body-item">
                        <span>开启 Tags-View</span>
                        <span>
                            <el-switch :value="getHeaderTabs" @change="changeHeaderTabs"/>
                        </span>
                    </div>

                    <div class="setting-content-drawer-body-item">
                        <span>开启 Header栏</span>
                        <span>
                            <el-switch :value="getHeaderShow" @change="changeHeaderShow"/>
                        </span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
    name: 'Setting',
    components: {
        ThemePicker: () => import('@/base-ui/theme-picker'),
    },
    data() {
        return {
            show: false
        }
    },
    computed: {
        ...mapGetters(['getNavMenuLogo', 'getHeaderTabs', 'getHeaderShow'])
    },
    methods: {
        ...mapMutations(['SET_NAVMENULOGO', 'SET_HEADERTABS', 'SET_HEADERSHOW']),
        changeLogo(value) {
            this.SET_NAVMENULOGO(value)
        },
        changeHeaderTabs(value) {
            this.SET_HEADERTABS(value)
        },

        changeHeaderShow(value) {
            this.SET_HEADERSHOW(value)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-color-picker {
    height: auto;
}

.setting {
    position: absolute;
    top: 0;
    bottom: 0;

    &-bg {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba($--color-black, .5);
    }

    &-content {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        padding: 16px;
        box-sizing: border-box;
        width: 100%;
        max-width: 260px;
        background-color: $--color-white;
        box-shadow: 0 0 15px 0 rgb(0 0 0 / .05);
        transition: $--animate-default;
        transform: translateX(100%);

        &.show {
            transform: translateX(0);
        }

        &-icon {
            position: absolute;
            top: 30%;
            left: -48px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 48px;
            height: 48px;
            background-color: $--color-primary;
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
            cursor: pointer;

            i {
                font-size: 24px;
                color: $--color-white;
                vertical-align: baseline;
            }
        }

        &-drawer {
            &-title {
                margin-top: 20px;
                margin-bottom: 25px;
                font-weight: bold;
                color: rgba($--color-black, .85);
            }

            &-body {
                &-item {
                    padding: 12px 0;
                    color: rgba($--color-black, .65);

                    span:first-child {
                        vertical-align: -4px;
                    }

                    span:last-child {
                        float: right;
                    }

                    &::after {
                        content: "";
                        display: block;
                        clear: both;
                    }
                }
            }
        }
    }
}
</style>
