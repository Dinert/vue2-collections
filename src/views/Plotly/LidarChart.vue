<template>
    <div class="lidarChart">
        <div id="container"></div>
    </div>
</template>

<script>
import LaserRadar from '@/base-ui/plotly/radar'
const lidarJson = require('@/assets/json/radar.json')
export default {
    name: 'LidarChart',

    mounted() {
        this.laserRadar = new LaserRadar({
            data: lidarJson,
            container: '#container'
        })

        this.$notify.success({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `<h3>功能说明：</h3>
                      <h4>1. Plotly.js生成不同高度的激光雷达图</h4>
                      <h4>2. 使用canvas自定义画线，绘制云底高和边界层</h4>
                    `,
            duration: 0
        })
    },
    data() {
        return {
            laserRadar: null
        }
    },
    computed: {

    },
    methods: {

    },

}
</script>

<style lang="scss" scoped>
.lidarChart {
    height: 100%;

    #container {
        &::v-deep {
            & > div {
                margin: 16px;
            }
        }
    }
}
</style>
