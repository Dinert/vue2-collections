export default {
    SET_THEMEPRIMARY(state, pyload) {
        state.theme.primary = pyload
    },
    SET_NAVMENUCOLLAPSE(state, pyload) {
        state.navMenu.collapse = pyload
    },
    SET_ISFULLSCREEN(state, pyload) {
        state.isFullscreen = pyload
    },
    SET_ELEMENTSIZE(state, pyload) {
        state.element.size = pyload
    },
    SET_WINDOWOFFSET(state, pyload) {
        state.windowOffset = pyload
    },


    SET_WINDOWWIDTH1024(state, pyload) {
        state.windowWidth.lessThan1024 = pyload
    },
    SET_WINDOWWIDTH1000(state, pyload) {
        state.windowWidth.lessThan1000 = pyload
    },

    SET_NAVMENULOGO(state, pyload) {
        state.navMenu.logo = pyload
    },

    SET_HEADERTABS(state, pyload) {
        state.headerTabs = pyload
    },

    SET_HEADERSHOW(state, pyload) {
        state.header.show = pyload
    }
}
