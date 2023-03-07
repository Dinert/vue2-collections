L.TileLayer.BackTrajectory = L.TileLayer.extend({
    line: null,
    point: [],
    animatePoint: null,
    pointLayer: null,
    lineOptions: null,
    animatePointOptions: null,
    init: function () {
        this.data = this._url.data;
        this.map = this._url.map
        this.mapv = this._url.mapv

        this.lineData = []; // 线数据
        this.animatePointData = []; // 动画点数据

        this.startPointLayer = []   // 开始点图层
        this.endPointLayer = []   // 结束点图层

        this.pointData = []; // 点数据

        this.heightColor = {
            100: '#5b8ff9',
            200: '#ff99c3',
            500: '#41c851',
            1000: '#d957ff',
            1500: '#f6bd16',
            ...this._url.heightColor
        }

        this.legendColor = []
        this.legendHeight = []

        for(const prop in this.heightColor) {
            this.legendColor = this.heightColor[prop]
            this.legendHeight = Number(prop)
        }

        this.dataProcess();
        this.drawLine();
        this.drawAnimatePoint();
        this.drawPoint();
        return this;
    },

    // 数据处理
    dataProcess: function () {
        var data = this.data, lng, lat, endLng, endLat;

        for(var i = 0; i < data.length; i ++ ) {

            let hight = parseInt(data[i].Hight)

            var tempArr = [];
            var tempData = data[i].Table;
            lng = tempData[tempData.length - 1].Longitude;
            lat = tempData[tempData.length - 1].Latitude;

            endLng = tempData[0].Longitude;
            endLat = tempData[0].Latitude

            this.pointData.push({lng: lng, lat: lat});
            this.pointData.push({lng: endLng, lat: endLat});

            for(var j = 0; j < tempData.length; j ++) {
                lng = tempData[j].Longitude;
                lat = tempData[j].Latitude;
                tempArr.push([lng, lat]);

                this.animatePointData.push({
                    geometry: {
                        type: "Point",
                        coordinates: [lng, lat],
                    },
                    count: hight,
                    time: tempData.length - j
                });
            }

            // 线数据
            this.lineData.push({
                geometry: {
                    type: "LineString",
                    coordinates: tempArr
                },
                count: hight
            });

            // 起点数据
            let startPoint = L.circleMarker({lng: lng, lat: lat}, {
                color: this.heightColor[hight],
                weight: 2,
                fill: this.heightColor[hight],
                fillOpacity: .5,
            })

             // 终点数据
            let endPoint = L.circleMarker({lng: endLng, lat: endLat}, {
                color: this.heightColor[hight],
                weight: 2,
                radius: 15,
                fill: this.heightColor[hight],
                fillOpacity: .5,
            })

            this.startPointLayer.push(startPoint)
            this.endPointLayer.push(endPoint)
        }
    },

    // 绘制线
    drawLine: function () { // 绘制线

        this.lineOptions = {
            shadowBluer: 3,
            lineWidth: 3.0,
            draw: 'simple',
            splitList: this.heightColor
        }

        var data = new this.mapv.DataSet(this.lineData);

        this.line = L.supermap.mapVLayer(data, this.lineOptions)
        console.log(this.line, 'line')
        this.map.addLayer(this.line)
    },
    drawAnimatePoint: function () { // 绘制动画点

        this.animatePointOptions = {

            animation: {
                stepsRange: {
                    start: 0,
                    end: 100
                },
                trails: 2,
                duration: 4,
            },
            draw: "category",
            splitList: this.heightColor
        }

        var data = new this.mapv.DataSet(this.animatePointData);
        // let pointLayer = L.supermap.mapVLayer(data, this.animatePointOptions)
        // this.animatePoint = this.map.addLayer(pointLayer);

    },
    drawPoint: function () { // 绘制起点和终点

        this.pointLayer = L.layerGroup([...this.startPointLayer, ...this.endPointLayer]);
        // mapv.addLayer(this.pointLayer);

    },
    hide: function () {
        this.line.onRemove();
        this.animatePoint.onRemove();
        this.pointLayer.clearLayers();
    },
    show: function () {
        this.line.onAdd(map);
        this.line.addData(this.lineData, this.lineOptions);
        this.animatePoint.onAdd(map);
        this.animatePoint.addData(this.animatePointData, this.animatePointOptions);

        this.pointLayer = L.layerGroup(this.point);
        mapv.addLayer(this.pointLayer);
    }
});


L.tileLayer.backTrajectory = function (options) {
    return new L.TileLayer.BackTrajectory(options);
}