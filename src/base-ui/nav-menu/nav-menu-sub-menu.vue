

<template>
    <div v-if="subMenuItems.subMenuItems">

        <el-submenu v-if="subMenuItems.subMenuItems && subMenuItems.subMenuItems.length" popper-class="layout-menu-content"
            :index="subMenuItems.url"
        >
            <template slot="title">
                <i class="el-icon el-icon-menu"></i>
                <span class="el-menu-item-name">{{ subMenuItems.caption }}</span>

            </template>

            <template v-for="child in subMenuItems.subMenuItems">
                <nav-menu-sub-menu
                    v-if="child.subMenuItems && child.subMenuItems.length > 0"
                    :key="child.id"
                    :sub-menu-items="child"
                />
                <el-menu-item v-else :key="child.id"
                    :index="child.url"
                    @click="menuItemClick(child)"
                >
                    <i class="el-icon el-icon-location"></i>
                    <span class="el-menu-item-name">{{ child.caption }}</span>

                </el-menu-item>
            </template>
        </el-submenu>

        <template v-else>
            <el-tooltip placement="right" :content="subMenuItems.caption"
                :disabled="!getNavMenuCollapse"
            >
                <el-menu-item :index="subMenuItems.url" @click="menuItemClick(subMenuItems)">
                    <i class="el-icon el-icon-menu"></i>
                    <span class="el-menu-item-name">{{ subMenuItems.caption }}</span>
                </el-menu-item>
            </el-tooltip>

        </template>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name: 'NavMenuSubMenu',
    props: {
        subMenuItems: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['getNavMenuCollapse'])
    },
    methods: {
        menuItemClick(item) {
            this.url = item.url
            this.$router.push({path: item.url})
        }
    }
}
</script>
<style lang="scss" scoped>
.ali-icon {
    margin-right: 6px;
    font-size: 16px;
}
</style>
