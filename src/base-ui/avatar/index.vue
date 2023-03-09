<template>
    <el-dropdown placement="bottom"
        @command="commandSelect"
    >
        <div class="avater">
            <img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" alt="图片">
            <span>哈哈哈哈</span>
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item of operations" :key="item.value"
                :command="item.value" :divided="item.divided"
            >
                <svg-icon v-if="item.icon" class="el-dropdown-menu__item-icon"
                    :icon-class="item.icon"
                />
                <span class="el-dropdown-menu__item-text">
                    {{ item.message }}
                </span>
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
export default {
    name: 'Avatar',
    data() {
        return {
            operations: [
                {
                    message: '帐号信息',
                    value: 'accountInformation',
                    icon: 'accountInformation'
                },
                {
                    message: '消息中心',
                    value: 'messageCenter',
                    icon: 'messageCenter'
                },
                {
                    message: '修改密码',
                    value: 'changePassword',
                    icon: 'changePassword'
                },
                {
                    message: '退出登录',
                    value: 'logOut',
                    icon: 'logOut',
                    divided: true
                }
            ]
        }
    },
    methods: {
        commandSelect(item) {
            if (item === 'logOut') {
                this.$router.replace({path: `/login?redirect=${this.$route.fullPath}`})
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.el-dropdown {
    height: 100%;

    .avater {
        display: flex;
        align-items: center;
        padding: 0 8px;
        height: 100%;

        img {
            width: 40px;
            height: 40px;
            border-radius: 10px;
        }

        span {
            margin-left: 8px;
        }
    }
}

</style>
