/* Dinert-leaflet-Windy 风场 */


L.TileLayer.Windy = L.TileLayer.extend({
    init: function () {
        this.map = this._url.map;
        this.windData = this._url.windData;
        this.overlayData = this._url.overlayData;
        this.windCacheData = [];
        this.overlayCacheData = [];
        this.chinaData = this._url.chinaData;
        this.windyOutLineData = this._url.windyOutLineData;
        this.verlayOutLineData = this._url.verlayOutLineData;
        this.type = this._url.type;
        this.delay = this._url.delay || 100;
        this.windyFlag = this._url.windyFlag === false ? false : true;
        this.overlayFlag = this._url.overlayFlag === false ? false : true;
        this.startColor = this._url.startColor;
        this.endColor = this._url.endColor;

        this._overlayProduct = null;
        this.windId = this._url.windId || "wind";
        this.windy = null;
        this.overlayId = this._url.overlayId || "overlay";
        this.point = [];
        this.createDom();
        this.changeSize();
        this.initWidy();
        this.bindEvent();
        this.resize();
        return this;
    },
    changeSize: function () { // 重置canvas的宽高
        var _this = this;
        this.width = this.map.getSize().x;
        this.height = this.map.getSize().y;
        $("#" + this.windId + ", #" + this.overlayId).attr({
            width: _this.width,
            height: _this.height
        });
        _this.setTranslate();
    },

    changewindyOutLineData() {

    },

    createDom: function () { // 创建容器
        this.windCanvas = d3.select(".leaflet-overlay-pane").append("canvas").attr("id", this.windId);
        this.overlayCanvas = d3.select(".leaflet-overlay-pane").append("canvas").attr("id", this.overlayId);
    },

    clearOverlay: function () {
        var ctx1 = $("#" + this.overlayId)[0].getContext("2d");
        ctx1.clearRect(0, 0, this.width, this.height);
    },

    closeOverlay: function () {

        this.windy.releaseOverlay();
        this.clearOverlay();
        this.overlayFlag = false;
    },

    closeWind: function () {

        this.clearWind();
        this.windyFlag = false;
    },

    openWind: function () {
        this.windyFlag = true;
        this.startWind();
    },
    openOverlay: function () {
        this.overlayFlag = true;
        this.showOverlay();
    },
    clearWind: function () {
        this.windy.stop();
        var ctx = $("#" + this.windId)[0].getContext("2d");
        ctx.clearRect(0, 0, this.width, this.height);
    },
    setTranslate: function () { // 获取transform的3D值
        var d3Value = $(".leaflet-map-pane")[0].style.transform;
        var reg = /(?<=\().+?(?=\))/g; // 取出括号里的值
        var str = d3Value.match(reg)[0].split(",");
        var newValue = "";
        for (var i = 0; i < str.length; i++) {
            var temp = ", ";
            if (i === str.length - 1) {
                temp = "";
            }
            newValue += (-parseInt(str[i])) + "px" + temp
        }
        newValue = "translate3d(" + newValue + ")";
        $("#" + this.windId + ", #" + this.overlayId).css("transform", newValue);
    },
    initWidy: function () { // 初始化风场和渲染
        var _this = this;
        _this.windy = new Windy({
            windyOutLineData: _this.windyOutLineData,
            verlayOutLineData: _this.verlayOutLineData,
            windCanvas: this.windCanvas.node(),
            overlayCanvas: this.overlayCanvas.node(),
            map: _this.map,
            overlayId: _this.overlayId,
            windId: _this.windId,
            startColor: _this.startColor,
            endColor: _this.endColor
        });
        this.setWind();
        this.startWind();
        this.showOverlay();
    },

    startWind: function () { // 开启风场
        var _this = this;
        if (this.windyFlag) {
            var timer = setTimeout(function () {
                _this.windy.start(
                    [
                        [0, 0],
                        [_this.width, _this.height]
                    ], _this.width, _this.height);
                clearTimeout(timer);
            }, 0);
        }
    },

    stopWind: function () { // 暂停风场
        this.windy.stop();
    },

    setWind: function () { // 风场的数据
        if (this.windData.length) {
            this.windy.setData(this.windData);
        }
    },

    showOverlay: function () { // 渲染地图的数据
        var _this = this;
        if (this.overlayFlag) {
            _this.windy.setOverlay(_this.type, _this.overlayData);
        }
    },
    changeWindData: function (data) {   // 改变风场数据
        this.clearWind();
        this.windData = data;
        this.setWind();
        this.startWind();
    },
    changeOverlayData: function (data) {    // 改变渲染数据
        this.clearOverlay();
        this.overlayData = data;
        this.showOverlay();
    },
    bindEvent: function () {
        var _this = this;
        var timer = null;

        this.map.on("zoomstart", function () { // 地图缩放开始
            _this.clearOverlay();
            _this.clearWind();
            clearTimeout(timer);
            timer = null;
        });

        this.map.on("movestart", function () { // 地图拖动开始
            console.log("地图拖动开始");
            _this.clearOverlay();
            _this.clearWind();
            clearTimeout(timer);
            timer = null;
        });

        this.map.on("moveend", function () { // 地图拖动完成
            console.log("地图拖动完成");
            if (!timer) {
                timer = setTimeout(function () { // 增加延迟，解决地图卡顿问题
                    _this.map.invalidateSize();
                    _this.changeSize();
                    _this.showOverlay();
                    _this.startWind();
                    clearTimeout(timer);
                    timer = null;
                }, _this.delay);
            }
        });
    },
    resize: function () { // 监听浏览器改变 地图也调用拖动完成
        //var _this = this;
        //var timer = null;
        //$(window).resize(function () {
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
        //});
    }
});

L.tileLayer.windy = function (options) {
    return new L.TileLayer.Windy(options);
}