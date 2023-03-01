<template>
    <div class="home">
        <el-button @click="flag = !flag">切换</el-button>
        <el-row>
            <transition enter-active-class="animate__animated animate__rollIn"
                leave-active-class="animate__animated animate__rollOut"
            >
                <el-button v-if="flag" plain>朴素按钮</el-button>
            </transition>
            <el-button type="primary" plain>主要按钮</el-button>
            <el-button type="success" plain>成功按钮</el-button>
            <el-button type="info" plain>信息按钮</el-button>
            <el-button type="warning" plain>警告按钮</el-button>
            <el-button type="danger" plain>危险按钮</el-button>
        </el-row>

        <el-row>
            <el-button round>圆角按钮</el-button>
            <el-button type="primary" round> 主要按钮</el-button>
            <el-button type="success" round>成功按钮</el-button>
            <el-button type="info" round>信息按钮</el-button>
            <el-button type="warning" round>警告按钮</el-button>
            <el-button type="danger" round>危险按钮</el-button>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Home',
    mixins: [],
    mounted() {},
    data() {
        return {
            flag: true
        };
    },
    computed: {
        ...mapGetters(['getWindowOffset'])
    },
    methods: {

    },
};
</script>

<style lang="scss" scoped>
.home {
    display: block;
}
</style>
