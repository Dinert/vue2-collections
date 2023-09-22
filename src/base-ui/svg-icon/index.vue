<template>
    <svg :class="svgClass" aria-hidden="true"
        v-on="$listeners"
    >
        <use :xlink:href="iconName"/>
    </svg>
</template>

<script>
export default {
    name: 'svg-icon',
    props: {
        iconClass: {
            type: String,
            required: true,
            default: ''
        },
        className: {
            type: String,
            default: ''
        }
    },

    computed: {
        svgClass() {
            return this.className ? 'svg-icon ' + this.className : 'svg-icon'
        },

        iconName() {
            return `#icon-${this.iconClass}`
        },
    }
}
</script>

<style lang="scss" scoped>
.svg-icon {
    overflow: hidden;
    width: 1em;
    height: 1em;
    vertical-align: -.15em;
    fill: currentcolor;
}
</style>
