<template>
    <div class="home">

    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: 'Home',
    mixins: [],
    mounted() {},
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['getWindowOffset'])
    },
    methods: {

    },
}
</script>

<style lang="scss" scoped>
.home {
    display: block;
}
</style>
