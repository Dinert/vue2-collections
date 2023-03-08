import _ from 'lodash'
import * as echarts from 'echarts';
import "echarts/extension/bmap/bmap"

const BackWardTrack = function (options) {
  this.options = {
    container: "BackwardTrajectoryGraspChart",
    data: [],
    dataBuffer: {}, //缓存数据
    config: {
      //图形配置
      animationThreshold: 3000,
      series: [],
    },
    colors: ["#5b8ff9", "#ff99c3", "#41c851", "#d957ff", "#f6bd16"],
    heights: [100, 200, 500, 1000, 1500],
  };

  this.options = _.defaultsDeep(_.cloneDeep(options), this.options)

  this.data = this.options.data;
  this.container = this.options.container;
  this.chart = null;
};

BackWardTrack.prototype.init = function () {
  this.dataGroup(this.options.data); //组装数据参数

  //创建配置项
  this.createTitle();
  this.createToolTip();
  this.createMap();
  this.createVisualMap();
  this.createLegend();
  this.createPoint();
  this.createLine();

  this.drawing(); // 绘制
  this.mapsInits(); // 自适应窗口
  this.resize();
  return this;
};
BackWardTrack.prototype.createTitle = function () {
  this.options.config.title = {
    text: null,
    subtext: "",
    x: "center",
    y: 15,
    textStyle: {
      color: "#fff",
    },
  };
};
BackWardTrack.prototype.createToolTip = function () {
  this.options.config.tooltip = {
    //show: false,
    trigger: "item",
    formatter: function (params) {
      return params.data.tooltip;
    },
  };
};
BackWardTrack.prototype.createMap = function () {
  this.options.config.bmap = {
    center: [108.5525, 34.3227],
    zoom: 5,
    roam: true,
    mapStyle: {
      //style: 'midnight'
    },
  };
};
BackWardTrack.prototype.createVisualMap = function () {
  var colors = this.options.colors;
  var heights = this.options.heights;
  var pieces = [];
  for (var i = 0; i < colors.length; i++) {
    var min = heights[i];
    if (i === 0) {
      min = 0;
    }

    pieces.push({
      min: min,
      max: heights[i],
      color: colors[i],
      label: heights[i] + "(米)",
    });
  }
  this.options.config.visualMap = {
    x: "20px",
    bottom: "20px",
    pieces: pieces,
    color: ["#d94e5d", "#eac736", "#50a3ba"],
    textStyle: {
      color: "#666",
    },
    backgroundColor: "#E0E0E0",
    seriesIndex: [],
  };
};
BackWardTrack.prototype.createLegend = function () {
  this.options.config.legend = {
    orient: "vertical",
    x: "right",
    data: [],
    selectedMode: "multiple",
    textStyle: {
      color: "auto",
    },
  };
  for (var StationId in this.options.dataBuffer) {
    var itemData = this.options.dataBuffer[StationId];
    for (var i = 0; i < itemData.length; i++) {
      this.options.config.legend.data.push(
        itemData[i][0].TimePoint.split(":")[0]
      );
    }
  }
};
BackWardTrack.prototype.createPoint = function () {
  for (var StationId in this.options.dataBuffer) {
    var itemData = this.options.dataBuffer[StationId];
    //绘制终点
    this.options.config.series.push({
      type: "effectScatter",
      mapType: "china",
      coordinateSystem: "bmap",
      zlevel: 300,
      symbolSize: 15,
      label: {
        normal: {
          show: true,
          position: "right",
          formatter: "{b}",
          textStyle: {
            fontWeight: 500,
            fontSize: "16",
            fontFamily: "宋体",
          },
        },
      },
      showEffectOn: "render",
      rippleEffect: {
        period: 8,
        scale: 2,
        brushType: "stroke",
      },

      itemStyle: {
        normal: {
          color: "#41c851",
        },
      },
      data: [
        {
          name: this.options.stationName,
          value: [
            itemData[0] && itemData[0][0].Longitude,
            itemData[0] && itemData[0][0].Latitude,
          ],
        },
      ],
    });
    //绘制起始点
    for (var i = 0; i < itemData.length; i++) {
      var name = itemData[i] && itemData[i][0].TimePoint.split(":")[0];
      this.options.config.series.push({
        name: name,
        type: "effectScatter",
        mapType: "china",
        coordinateSystem: "bmap",
        zlevel: 10,
        //symbol: 'emptyCircle',
        symbolSize: 10,
        symbolSize: 6,
        rippleEffect: {
          period: 8,
          scale: 4,
          brushType: "stroke",
        },
        showEffectOn: "render",
        itemStyle: {
          normal: {
            textStyle: {
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "17",
              fontFamily: "cursive",
            },
            color: "#00E400",
            label: {
              show: false,
              formatter: function (params, ticket, callback) {
                //格式化展现（标签+值）
                return params.name;
              },
              textStyle: {
                fontWeight: 300,
                fontSize: "16",
                fontFamily: "宋体",
                color: "#000",
              },
              offset: [0, -15],
            },
          },
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        data: [
          {
            value: [
              itemData[i] && itemData[i][itemData[i].length - 1].Longitude,
              itemData[i] && itemData[i][itemData[i].length - 1].Latitude,
              itemData[i] && itemData[i][0].Height,
            ],
            name: name,
            tooltip:
              "时间:&nbsp;" + name + "</br>高度:&nbsp;" + itemData[i] &&
              itemData[i][0].Height,
          },
        ],
      });
      this.options.config.visualMap.seriesIndex.push(
        this.options.config.series.length - 1
      );
    }
  }
};
BackWardTrack.prototype.createLine = function () {
  for (var StationId in this.options.dataBuffer) {
    var itemData = this.options.dataBuffer[StationId];

    for (var i = 0; i < itemData.length; i++) {
      var lineItem = [];
      //var lineData = [];
      for (var j = itemData[i].length - 1; j >= 0; j--) {
        lineItem.push([itemData[i][j].Longitude, itemData[i][j].Latitude]);
        //lineData.push({
        //    coords: [[itemData[i][j + 1].Lon, itemData[i][j + 1].Lat], [itemData[i][j].Lon, itemData[i][j].Lat]],
        //    index: i,
        //    value: itemData[i][0].Height
        //});
      }

      this.options.config.series.push({
        name: itemData[i][0].TimePoint.split(":")[0],
        type: "lines",
        mapType: "china",
        coordinateSystem: "bmap",
        zlevel: 10,
        polyline: true,
        data: [
          {
            coords: lineItem,
            index: i,
            value: itemData[i][0].Height,
          },
        ],
        //data: lineData,
        //线上面的动态特效
        effect: {
          show: true,
          period: 4,
          trailLength: 0.5,
          symbol: "triangle",
          symbolSize: 8,
          loop: false,
        },
        lineStyle: {
          normal: {
            width: 2,
            color: "#00E400",
            curveness: 0.2,
          },
        },
      });
      this.options.config.visualMap.seriesIndex.push(
        this.options.config.series.length - 1
      );
    }
  }
};
BackWardTrack.prototype.mapsInits = function () {
  this.bmap = this.chart.getModel().getComponent("bmap").getBMap();
  var overlays = [];
  for (var StationId in this.options.dataBuffer) {
    var itemData = this.options.dataBuffer[StationId];

    for (var i = 0; i < itemData.length; i++) {
      for (var j = 0; j < itemData[i].length; j++) {
        overlays.push(
          new BMap.Point(itemData[i][j].Longitude, itemData[i][j].Latitude)
        );
      }
    }
  }
  this.bmap.setViewport(overlays);
};
BackWardTrack.prototype.drawing = function () {
  this.chart && this.chart.dispose && this.chart.dispose();
  this.chart = echarts.init(document.getElementById(this.options.container));
  this.chart.setOption(this.options.config, true);
};
BackWardTrack.prototype.dataGroup = function () {
  var result = [];
  for (var i = 0; i < this.data.length; i++) {
    result.push(this.data[i].Table);
  }
  this.options.dataBuffer[this.data[0] && this.data[0].StationId] = result;
};

BackWardTrack.prototype.resize = function () {
  console.log(this.chart);
  var _this = this;
  if (this.chart && this.chart.isDisposed) {
    var timer = null;
    window.onresize = function () {
        if (!timer) {
          timer = setTimeout(function () {
            _this.chart.resize();
            clearTimeout(timer);
            timer = null;
          }, 100);
        }
    }

  }
};

export default BackWardTrack