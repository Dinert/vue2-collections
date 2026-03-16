/* Dinert-leaflet-Windy 风场 */


L.TileLayer.Windy = L.TileLayer.extend({
    init: function () {
        this.map = this._url.map
        this.windData = this._url.windData
        this.overlayData = this._url.overlayData
        this.windCacheData = []
        this.overlayCacheData = []
        this.chinaData = this._url.chinaData
        this.windyOutLineData = this._url.windyOutLineData
        this.verlayOutLineData = this._url.verlayOutLineData
        this.type = this._url.type
        this.delay = this._url.delay || 100
        this.windyFlag = this._url.windyFlag !== false
        this.overlayFlag = this._url.overlayFlag !== false
        this.startColor = this._url.startColor
        this.endColor = this._url.endColor

        this.timer2 = null
        this.timer3 = null
        this.timer4 = null

        this._overlayProduct = null
        this.windId = this._url.windId || 'wind'
        this.windy = null
        this.overlayId = this._url.overlayId || 'overlay'
        this.point = []
        this.createDom()
        this.changeSize()
        this.initWidy()
        this.bindEvent()
        this.resize()

        return this
    },

    getDom(name) {
        return document.querySelector(name)
    },

    changeSize: function () { // 重置canvas的宽高
        const _this = this
        this.width = this.map.getSize().x
        this.height = this.map.getSize().y

        this.getDom('#' + this.windId).setAttribute('width', _this.width)
        this.getDom('#' + this.windId).setAttribute('height', _this.height)

        this.getDom('#' + this.overlayId).setAttribute('width', _this.width)
        this.getDom('#' + this.overlayId).setAttribute('height', _this.height)

        _this.setTranslate()
    },

    changewindyOutLineData() {

    },

    createDom: function () { // 创建容器
        const windCanvas = document.createElement('canvas')
        windCanvas.setAttribute('id', this.windId)
        this.getDom('#' + this.map._container.id + ' .leaflet-overlay-pane').append(windCanvas)
        this.windCanvas = windCanvas

        const overlayCanvas = document.createElement('canvas')
        overlayCanvas.setAttribute('id', this.overlayId)
        this.getDom('#' + this.map._container.id + ' .leaflet-overlay-pane').append(overlayCanvas)
        this.overlayCanvas = overlayCanvas


    },

    clearOverlay: function () {
        const ctx1 = this.getDom('#' + this.overlayId).getContext('2d')
        ctx1.clearRect(0, 0, this.width, this.height)
    },

    closeOverlay: function () {

        this.windy.releaseOverlay()
        this.clearOverlay()
        this.overlayFlag = false
    },

    closeWind: function () {
        this.bindEventOff()
        this.clearWind()
        clearTimeout(this.timer2)
        this.timer2 = null
        this.windyFlag = false
    },

    openWind: function () {
        this.windyFlag = true
        this.startWind()
    },
    openOverlay: function () {
        this.overlayFlag = true
        this.showOverlay()
    },
    clearWind: function () {
        this.windy.stop()
        const ctx = this.getDom('#' + this.windId).getContext('2d')
        ctx.clearRect(0, 0, this.width, this.height)
    },
    setTranslate: function () { // 获取transform的3D值
        const d3Value = this.getDom('#' + this.map._container.id + ' .leaflet-map-pane').style.transform
        const reg = /(?<=\().+?(?=\))/g // 取出括号里的值
        const str = d3Value.match(reg)[0].split(',')
        let newValue = ''
        for (let i = 0; i < str.length; i++) {
            let temp = ', '
            if (i === str.length - 1) {
                temp = ''
            }
            newValue += (-parseInt(str[i])) + 'px' + temp
        }
        newValue = 'translate3d(' + newValue + ')'
        this.getDom('#' + this.windId).style.transform = newValue
        this.getDom('#' + this.overlayId).style.transform = newValue
    },
    initWidy: function () { // 初始化风场和渲染
        const _this = this
        _this.windy = new Windy({
            windyOutLineData: _this.windyOutLineData,
            verlayOutLineData: _this.verlayOutLineData,
            windCanvas: this.windCanvas,
            overlayCanvas: this.overlayCanvas,
            map: _this.map,
            overlayId: _this.overlayId,
            windId: _this.windId,
            startColor: _this.startColor,
            endColor: _this.endColor
        })
        this.setWind()
        this.startWind()
        this.showOverlay()
    },

    startWind: function () { // 开启风场
        const _this = this
        if (this.windyFlag) {
            var timer = setTimeout(() => {
                _this.windy.start(
                    [
                        [0, 0],
                        [_this.width, _this.height]
                    ], _this.width, _this.height)
                clearTimeout(timer)
            }, 0)
        }
    },

    stopWind: function () { // 暂停风场
        this.windy.stop()
    },

    setWind: function () { // 风场的数据
        if (this.windData && this.windData.length) {
            this.windy.setData(this.windData)
        }
    },

    showOverlay: function () { // 渲染地图的数据
        const _this = this
        if (this.overlayFlag) {
            _this.windy.setOverlay(_this.type, _this.overlayData)
        }
    },
    changeWindData: function (data) { // 改变风场数据
        this.clearWind()
        this.windData = data
        this.setWind()
        this.startWind()
    },
    changeOverlayData: function (data) { // 改变渲染数据
        this.clearOverlay()
        this.overlayData = data
        this.showOverlay()
    },

    bindMapStart() {
        this.clearOverlay()
        this.clearWind()
        clearTimeout(this.timer2)
        this.timer2 = null
    },

    bindMapMoveStart() {
        this.clearOverlay()
        this.clearWind()
        clearTimeout(this.timer2)
        this.timer2 = null
    },
    bindMapMoveEnd() {
        console.log('地图拖动完成')
        if (!this.timer2) {
            this.timer2 = setTimeout(() => { // 增加延迟，解决地图卡顿问题
                this.map.invalidateSize()
                this.changeSize()
                this.showOverlay()
                this.startWind()
                clearTimeout(this.timer2)
                this.timer2 = null
            }, this.delay)
        }
    },

    bindEvent: function () {


        this.map.on('zoomstart', this.bindMapStart, this)

        this.map.on('movestart', this.bindMapMoveStart, this)

        this.map.on('moveend', this.bindMapMoveEnd, this)
    },

    bindEventOff: function () { // 移除事件
        this.map.off('zoomstart', this.bindMapStart, this)

        this.map.off('movestart', this.bindMapMoveStart, this)

        this.map.off('moveend', this.bindMapMoveEnd, this)
    },

    resize: function () { // 监听浏览器改变 地图也调用拖动完成
        // var _this = this;
        // var timer = null;
        // $(window).resize(function () {
        //    _this.clearWind();
        //    _this.clearOverlay();
        //    if (!timer) {
        //        timer = setTimeout(function () {
        //            console.log("浏览器大小改变");
        //            _this.changeSize();
        //            _this.startWind();
        //            _this.showOverlay();
        //            clearTimeout(timer);
        //            timer = null;
        //        }, _this.delay);
        //    }
        // });
    }
})

L.tileLayer.windy = function (options) {
    return new L.TileLayer.Windy(options)
}
