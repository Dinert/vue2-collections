<template>
    <div class="grain">
        <div id="container"></div>
    </div>
</template>

<script>
import Grain from '@/base-ui/plotly/grain'
const grainJson = require('@/assets/json/grain.json')
export default {
    name: 'Grain',

    mounted() {
        new Grain({
            data: [grainJson],
            container: 'container',
            config: {
                title: '粒径谱图'
            }
        }).init()

        this.$notify.success({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `<h3>功能说明：</h3>
                      <h4>1. Plotly.js生成不同高度的粒径谱图</h4>
                    `,
            duration: 0
        })
    },
    data() {
        return {

        }
    },
    computed: {

    },
    methods: {

    },

}
</script>

<style lang="scss" scoped>
.grain {
    height: 100%;

    #container {
        height: 400px;
    }
}
</style>
