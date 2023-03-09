<template>
    <el-dropdown placement="bottom" trigger="click"
        @command="changeSize"
    >
        <div class="item-size">
            <el-tooltip placement="top" content="布局大小">
                <svg-icon icon-class="size"/>
            </el-tooltip>
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item of sizeOptions" :key="item.value"
                :disabled="getElement.size === item.value" :command="item.value"
            >
                {{
                    item.label }}
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'size-select',
    data() {
        return {
            sizeOptions: [
                { label: 'Default', value: 'default' },
                { label: 'Medium', value: 'medium' },
                { label: 'Small', value: 'small' },
                { label: 'Mini', value: 'mini' }
            ]
        }
    },
    computed: {
        ...mapGetters(['getElement']),
    },
    methods: {
        ...mapMutations(['SET_ELEMENTSIZE']),

        changeSize(item) {
            this.$ELEMENT.size = item
            console.log(item, 'itemmmmmmmm')
            this.SET_ELEMENTSIZE(item)
            this.refreshView()
        },

        refreshView() {
            const { fullPath } = this.$route

            if(fullPath === '/404/index') {
                this.$router.replace({
                    path: '/home'
                })
            }else {
                this.$router.replace({
                    path: '/redirect' + fullPath
                })
            }


            setTimeout(() => {
                this.$router.replace({
                    path: fullPath
                })
            }, 10)
        }
    }
}
</script>

<style lang="scss" scoped>
.item-size {
    padding: 0 8px;
}

.svg-icon {
    font-size: 18px;
    color: $--color-icon;
}
</style>