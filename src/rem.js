(function () {
    // 用此匿名函数来修改字体大小 根据设备大小进行修改
    function resize() {
        const baseFontSize = 16 // 设计稿10像素相当于1rem,750px--75rem---各种屏幕的100%的宽度
        const designWidth = 1920// 设计稿的宽度
        const width = window.innerWidth// 获取屏幕的宽度
        const height = window.innerHeight
        let currentFontSize = null
        if (width / height <= 16 / 9) {
            currentFontSize = (width / designWidth) * baseFontSize
        } else {
            currentFontSize = (height / 9 * 16 / designWidth) * baseFontSize
        }

        document.querySelector('html').style.fontSize = currentFontSize + 'px'
        // c.log(currentFontSize)
        window.rem = currentFontSize
    }
    window.onresize = function () {
        resize()
    }
    // 当文档载入时监听修改文字大小
    document.addEventListener('DOMContentLoaded', resize)
}())
