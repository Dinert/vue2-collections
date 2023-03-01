<template>
    <div class="login">
        我是登录页
        <el-button @click="login">登录</el-button>
    </div>
</template>

<script>
export default {
    name: 'Login',
    mixins: [],
    components: {

    },
    created() {

    },
    mounted() {

    },
    data() {
        return {

        }
    },
    computed: {

    },
    methods: {
        login() {
            const redirect = this.$route.query.redirect
            if(redirect) {
                this.$router.push({path: redirect})
            }else {
                this.$router.push({path: '/home'})
            }
        }
    },

}
</script>


