<template>
    <div class="full" @click="changeIsFullScreen">
        <el-tooltip content="全屏">
            <svg-icon
                :icon-class="getIsFullscreen ? 'exit-fullscreen' : 'fullscreen'"
            />
        </el-tooltip>

    </div>
</template>

<script>
import screenfull from 'screenfull'
import {mapGetters, mapMutations} from 'vuex'
export default {
    name: 'ScreenFull',
    computed: {
        ...mapGetters(['getIsFullscreen'])
    },

    methods: {
        ...mapMutations(['SET_ISFULLSCREEN']),
        async changeIsFullScreen() {
            if (!screenfull.isEnabled) {
                return this.$message({
                    message: '您的浏览器不支持全屏效果',
                    type: 'warning'
                })
            }
            await screenfull.toggle()

            this.SET_ISFULLSCREEN(screenfull.isFullscreen)
        }
    }
}
</script>
<style lang="scss" scoped>
.full {
    padding: 0 8px;
}
</style>
