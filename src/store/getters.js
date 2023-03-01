
export default {
    getThemePrimary: state => {
        return state.theme.primary
    },
    getNavMenuCollapse: state => {
        return state.navMenu.collapse
    },
    getIsFullscreen: state => {
        return state.isFullscreen
    },
    getElement: state => {
        return state.element
    },
    getWindowOffset: state => {
        return state.windowOffset
    },
    getWindowWidth1024: state => {
        return state.windowWidth.lessThan1024
    },
    getWindowWidth1000: state => {
        return state.windowWidth.lessThan1000
    },
    getNavMenuLogo: state => {
        return state.navMenu.logo
    },

    getHeaderTabs: state => {
        return state.headerTabs
    },

    getHeaderShow: state => {
        return state.header.show
    }
}