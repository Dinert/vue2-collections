import variables from '@/assets/scss/variables/index.scss'

export default {
    // 主题
    theme: {
        primary: variables['theme-primary']
    },

    // 头部
    header: {
        show: true
    },

    // 菜单栏
    navMenu: {
        collapse: false,
        logo: false
    },

    headerTabs: false,

    // 是否全屏
    isFullscreen: false,

    // element-ui的配置
    element: {
        size: 'default'
    },

    windowOffset: {
        width: 0,
        height: 0,
    },

    windowWidth: {
        lessThan1024: false,
        lessThan1000: false
    }

}
