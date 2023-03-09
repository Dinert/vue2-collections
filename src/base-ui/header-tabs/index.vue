<template>
    <div class="headerTabs">
        <transition-group name="list" tag="ul"
            appear class="headerTabs-ul"
        >
            <template v-for="(item, index) in tabsList">
                <li
                    :key="item.url"
                    class="headerTabs-ul-li"
                    @click="changePath(item)"
                    @contextmenu.prevent="openMenu(item, $event, index)"
                >
                    <div
                        class="headerTabs-ul-li-item"
                        :class="{active: path === item.url}"
                    >
                        <span>{{ item.message }}</span>
                        <span
                            v-if="!item.ever"
                            class="headerTabs-ul-li-item-close el-icon-close"
                            @click="closeTabs(item, index)"
                        ></span>
                    </div>
                </li>
            </template>
        </transition-group>

        <ul
            v-show="contextVisible"
            class="headerTabs-contextmenu"
            :style="{
                left: positions.left + 'px',
                top: positions.top + 'px',
            }"
        >
            <li @click="refreshSelectTab">刷新</li>
            <li v-if="!currentTab.ever" @click="closed">关闭</li>
            <li @click="closedOther">关闭其它</li>
            <li @click="closedAll">关闭所有</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'HeaderTabs',

    mounted() {
        document.onclick = () => {
            this.contextVisible = false
        }
    },
    data() {
        return {
            contextVisible: false,
            tabsList: [
                {
                    message: '首页',
                    url: '/home',
                    ever: true,
                },
            ],

            positions: {
                top: 0,
                left: 0,
            },
            currentTab: {},
            currentTabIndex: null,
        }
    },
    computed: {
        path() {
            return this.$route.path
        },
    },
    methods: {
        changePath(item) {
            if (item.url !== this.$route.path) {
                if (this.$route.meta.title) {
                    this.$router.replace({path: item.url})
                } else {
                    this.$router.replace({path: '/404'})
                }
            }
        },

        closeTabs(item, index) {
            this.tabsList.splice(index, 1)
            if (item.url === this.path) {
                const prev = this.tabsList[index]
                const last = this.tabsList[index - 1]
                if (prev) {
                    this.$router.replace({path: prev.url})
                } else if (last) {
                    this.$router.replace({path: last.url})
                } else {
                    this.$router.replace({path: '/'})
                }
            }
        },

        // 关闭
        async closed() {
            this.closeTabs(this.currentTab, this.currentTabIndex)
        },

        // 右键菜单
        openMenu(item, event, index) {
            this.positions.left = event.x + 10
            this.positions.top = event.y + 10
            this.currentTab = item
            this.contextVisible = true
            this.currentTabIndex = index
        },

        // 刷新
        refreshSelectTab() {
            this.$router.replace({
                path: '/',
            })

            this.$nextTick(() => {
                this.$router.replace({
                    path: this.currentTab.url,
                })
            })
        },

        // 关闭其它
        closedOther() {
            if (!this.currentTab.ever) {
                this.tabsList.splice(this.currentTabIndex + 1)
                this.tabsList.splice(1, this.currentTabIndex - 1)
            } else {
                this.tabsList.splice(1)
            }

            this.$nextTick(() => {
                this.$router.replace({
                    path: this.currentTab.url,
                })
            })
        },

        // 关闭所有
        closedAll() {
            this.tabsList.splice(1)

            this.$nextTick(() => {
                this.$router.replace({
                    path: '/',
                })
            })
        },
    },
    watch: {
        path: {
            handler(newValue, oldValue) {
                const index = this.tabsList.findIndex(item => item.url === newValue)
                if (index === -1) {
                    if (this.$route.meta.title) {
                        this.tabsList.push({
                            url: newValue,
                            message: this.$route.meta.title,
                        })
                    } else {
                        const tempIndex = this.tabsList.findIndex(
                            item => item.url === '/404'
                        )
                        if (tempIndex === -1) {
                            this.tabsList.push({
                                url: '/404',
                                message: '404',
                            })
                        }
                    }
                }
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.list-item {
    display: inline-block;
    margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
    transition: $--animate-default;
}

.list-enter {
    opacity: 0;
    transform: translateX(-100%);
}

.list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(100%);
}

.headerTabs {
    &-ul {
        height: 100%;

        &-li {
            display: inline-block;
            margin-top: 4px;
            margin-left: 8px;
            height: 100%;

            &-item {
                display: inline-block;
                overflow: hidden;
                padding: 0 8px;
                height: 26px;
                font-size: 12px;
                border: 1px solid #d8dce5;
                line-height: 26px;
                cursor: pointer;

                &-close {
                    display: inline-block;
                    padding: 6px;
                    border-radius: 50%;
                    transition: $--animate-default;
                    transform: scale(.6);

                    &::before {
                        vertical-align: middle;
                    }

                    &:hover {
                        background-color: rgba($--color-black, .3);
                    }
                }

                &:hover {
                    color: $--color-white;
                    background-color: rgba($--color-primary, .7);
                }

                &.active {
                    color: $--color-white;
                    background-color: $--color-primary;

                    &::before {
                        position: relative;
                        display: inline-block;
                        margin-right: 5px;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #fff;
                        content: "";
                    }
                }
            }

            &:first-child {
                margin-left: 16px;
            }
        }
    }

    &-contextmenu {
        position: absolute;
        z-index: 3000;
        margin: 0;
        padding: 5px 0;
        font-size: 12px;
        font-weight: 400;
        border-radius: 4px;
        color: #333;
        background-color: $--color-white;
        box-shadow: 2px 2px 3px 0 rgb(0 0 0 / .3);
        list-style-type: none;

        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;

            &:hover {
                color: $--color-primary;
                background-color: rgba($--color-primary, .1);
            }
        }
    }
}
</style>
