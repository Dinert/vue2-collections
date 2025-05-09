<template>
    <el-color-picker
        :value="getThemePrimary"
        :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d']"
        class="theme-picker"
        popper-class="theme-picker-dropdown"
        @change="themeChange"
    />


</template>
<script>

const version = require('element-ui/package.json').version // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF' // default color
import {mapGetters, mapMutations} from 'vuex'
export default {
    data() {
        return {
            chalk: '', // content of theme-chalk css
        }
    },
    computed: {
        ...mapGetters(['getThemePrimary'])
    },
    methods: {
        ...mapMutations(['SET_THEMEPRIMARY']),

        // 颜色更改
        themeChange(value) {
            this.SET_THEMEPRIMARY(value)

            // 修改
            if (typeof value !== 'string') {}

        },

        // 改变style中的值
        updateStyle(style, oldCluster, newCluster) {
            let newStyle = style
            oldCluster.forEach((color, index) => {
                newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
            })
            return newStyle
        },

        // 获取css的 标签
        getCSSString(url, variable) {
            return new Promise(resolve => {
                const xhr = new XMLHttpRequest()
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
                        resolve()
                    }
                }
                xhr.open('GET', url)
                xhr.send()
            })
        },

        // 生成颜色组
        getThemeCluster(theme) {
            const tintColor = (color, tint) => {
                let red = parseInt(color.slice(0, 2), 16)
                let green = parseInt(color.slice(2, 4), 16)
                let blue = parseInt(color.slice(4, 6), 16)

                if (tint === 0) {
                    return [red, green, blue].join(',')
                } else {
                    red += Math.round(tint * (255 - red))
                    green += Math.round(tint * (255 - green))
                    blue += Math.round(tint * (255 - blue))

                    red = red.toString(16)
                    green = green.toString(16)
                    blue = blue.toString(16)

                    return `#${red}${green}${blue}`
                }
            }

            const shadeColor = (color, shade) => {
                let red = parseInt(color.slice(0, 2), 16)
                let green = parseInt(color.slice(2, 4), 16)
                let blue = parseInt(color.slice(4, 6), 16)

                red = Math.round((1 - shade) * red)
                green = Math.round((1 - shade) * green)
                blue = Math.round((1 - shade) * blue)

                red = red.toString(16)
                green = green.toString(16)
                blue = blue.toString(16)

                return `#${red}${green}${blue}`
            }

            const clusters = [theme]
            for (let i = 0; i <= 9; i++) {
                const opacity = Number((i / 10).toFixed(2))
                const color = tintColor(theme, opacity)
                clusters.push(color)
            }
            clusters.push(shadeColor(theme, 0.1))
            return clusters
        },

        // 加载css
        loadCss() {
            return new Promise((resolve, reject) => {
                if (!this.chalk) {
                    const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
                    this.getCSSString(url, 'chalk').then(() => {
                        resolve()
                    }).catch(err => reject(err))
                } else {
                    resolve()
                }
            })

        }
    },
    watch: {
        async getThemePrimary(val, oldValue) {

            if (typeof val !== 'string') {return}
            const oldVal = oldValue || ORIGINAL_THEME
            const themeCluster = this.getThemeCluster(val.replace('#', ''))
            const originalCluster = this.getThemeCluster(oldVal.replace('#', ''))

            const getHandler = (variable, id) => {
                const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''))
                const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster)

                let styleTag = document.getElementById(id)
                if (!styleTag) {
                    styleTag = document.createElement('style')
                    styleTag.setAttribute('id', id)
                    document.head.appendChild(styleTag)
                }
                styleTag.innerText = newStyle
            }

            // 加载css
            this.loadCss().then(() => {
                getHandler('chalk', 'chalk-style')

                // 过滤当前的style是否有旧的主题颜色
                const styleAll = document.querySelectorAll('style')
                const styles = [].slice.call(styleAll)
                    .filter(style => {
                        const text = style.innerText
                        return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
                    })

                // 修改主题色
                styles.forEach(style => {
                    const {innerText} = style
                    if (typeof innerText !== 'string') {return}
                    style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
                })

                this.$emit('change', val)

            })


        }
    }

}
</script>

<style lange="scss">
.theme-message,
.theme-picker-dropdown {
    z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
    padding: 2px;
    width: 26px !important;
    height: 26px !important;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
}
</style>
