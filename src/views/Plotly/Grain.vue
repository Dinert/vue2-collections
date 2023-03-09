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
            data:[grainJson],
            container: 'container',
            config: {
                title: '粒径谱图'
            }
        }).init();
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