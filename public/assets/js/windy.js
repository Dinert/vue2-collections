"use strict";

var Windy = /*#__PURE__*/ (function () {

    function colorInterpolator(start, end) {
        var r = start[0];
        var g = start[1];
        var b = start[2];
        var Δr = end[0] - r;
        var Δg = end[1] - g;
        var Δb = end[2] - b;
        return (i, a) => {
            return [Math.floor(r + i * Δr), Math.floor(g + i * Δg), Math.floor(b + i * Δb), a];
        };
    }

    /**
     * Produces a color style in a rainbow-like trefoil color space. Not quite HSV, but produces a nice
     * spectrum. See http://krazydad.com/tutorials/makecolors.php.
     *
     * @param hue the hue rotation in the range [0, 1]
     * @param a the alpha value in the range [0, 255]
     * @returns {Array} [r, g, b, a]
     */
    function sinebowColor(hue, a) {
        // Map hue [0, 1] to radians [0, 5/6τ]. Don't allow a full rotation because that keeps hue == 0 and
        // hue == 1 from mapping to the same color.
        var τ = 2 * Math.PI;
        var rad = hue * τ * 5 / 6;
        rad *= 0.75;  // increase frequency to 2/3 cycle per rad

        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var r = Math.floor(Math.max(0, -c) * 255);
        var g = Math.floor(Math.max(s, 0) * 255);
        var b = Math.floor(Math.max(c, 0, -s) * 255);
        return [r, g, b, a];
    }

    var BOUNDARY = 0.45;
    var fadeToWhite = colorInterpolator(sinebowColor(1.0, 0), [255, 255, 255]);

    /**
     * Interpolates a sinebow color where 0 <= i <= j, then fades to white where j < i <= 1.
     *
     * @param i number in the range [0, 1]
     * @param a alpha value in range [0, 255]
     * @returns {Array} [r, g, b, a]
     */
    function extendedSinebowColor(i, a) {
        return i <= BOUNDARY ?
            sinebowColor(i / BOUNDARY, a) :
            fadeToWhite((i - BOUNDARY) / (1 - BOUNDARY), a);
    }

    /**
     * @returns {Number} the value x clamped to the range [low, high].
     */
    function clamp(x, low, high) {
        return Math.max(low, Math.min(x, high));
    }

    /**
     * @returns {number} the fraction of the bounds [low, high] covered by the value x, after clamping x to the
     *          bounds. For example, given bounds=[10, 20], this method returns 1 for x>=20, 0.5 for x=15 and 0
     *          for x<=10.
     */
    function proportion(x, low, high) {
        return (clamp(x, low, high) - low) / (high - low);
    }

    /**
     * Creates a color scale composed of the specified segments. Segments is an array of two-element arrays of the
     * form [value, color], where value is the point along the scale and color is the [r, g, b] color at that point.
     * For example, the following creates a scale that smoothly transitions from red to green to blue along the
     * points 0.5, 1.0, and 3.5:
     *
     *     [ [ 0.5, [255, 0, 0] ],
     *       [ 1.0, [0, 255, 0] ],
     *       [ 3.5, [0, 0, 255] ] ]
     *
     * @param segments array of color segments
     * @returns {Function} a function(point, alpha) that returns the color [r, g, b, alpha] for the given point.
     */
    function segmentedColorScale(segments) {
        var points = [];
        var interpolators = [];
        var ranges = [];
        for (let i = 0; i < segments.length - 1; i++) {
            points.push(segments[i + 1][0]);
            interpolators.push(colorInterpolator(segments[i][1], segments[i + 1][1]));
            ranges.push([segments[i][0], segments[i + 1][0]]);
        }

        return (point, alpha) => {
            var i;
            for (i = 0; i < points.length - 1; i++) {
                if (point <= points[i]) {
                    break;
                }
            }
            var range = ranges[i];
            return interpolators[i](proportion(point, range[0], range[1]), alpha);
        };
    }

    var FACTORIES = {
        wind: {
            filed: "scalar",
            type: "wind",
            name: "风场",
            units: [
                {
                    label: "km/h",
                    conversion: function conversion(x) {
                        return x * 3.6;
                    },
                    precision: 0
                }
            ],
            scale: {
                bounds: [0, 50],
                gradient: function gradient(v, a) {
                    return extendedSinebowColor(Math.min(v, 50) / 50, a);
                }
            }
        },
        aqi: {
            filed: "scalar",
            type: "aqi",
            name: "aqi",
            units: [
                {
                    label: "°C",
                    conversion: function conversion(x) {
                        return x;
                    },
                    precision: 0
                }
            ],
            scale: {
                bounds: [0, 500],
                gradient: segmentedColorScale([
                    [0, [0, 228, 0]],
                    [50, [255, 255, 0]],
                    [100, [255, 126, 0]],
                    [151, [255, 0, 0]],
                    [200, [153, 0, 76]],
                    [300, [126, 0, 35]],
                    [500, [88, 27, 67]]
                ]),
                gradientData: [
                    [0, [0, 228, 0]],
                    [50, [255, 255, 0]],
                    [100, [255, 126, 0]],
                    [151, [255, 0, 0]],
                    [200, [153, 0, 76]],
                    [300, [126, 0, 35]],
                    [500, [88, 27, 67]]
                ]
            }
        },
        "pm2.5": {
            filed: "scalar",
            type: "pm2.5",
            name: "pm2.5",
            units: [
                {
                    label: "%",
                    conversion: function conversion(x) {
                        return x;
                    },
                    precision: 0
                }
            ],
            scale: {
                bounds: [0, 500],
                gradient: segmentedColorScale([
                    [0, [0, 228, 0]],
                    [35, [255, 255, 0]],
                    [75, [255, 126, 0]],
                    [115, [255, 0, 0]],
                    [150, [153, 0, 76]],
                    [250, [126, 0, 35]],
                    [500, [88, 27, 67]]
                ]),
                gradientData: [
                    [0, [0, 228, 0]],
                    [35, [255, 255, 0]],
                    [75, [255, 126, 0]],
                    [115, [255, 0, 0]],
                    [150, [153, 0, 76]],
                    [250, [126, 0, 35]],
                    [500, [88, 27, 67]]
                ]
            }
        },
        pm10: {
            filed: "scalar",
            type: "pm10",
            name: "pm10",
            units: [
                {
                    label: "W/m²",
                    conversion: function conversion(x) {
                        return x;
                    },
                    precision: 0
                }
            ],
            scale: {
                bounds: [0, 10000],
                gradient: segmentedColorScale([
                    [0, [0, 228, 0]],
                    [50, [255, 255, 0]],
                    [150, [255, 126, 0]],
                    [250, [255, 0, 0]],
                    [350, [153, 0, 76]],
                    [420, [126, 0, 35]],
                    [10000, [88, 27, 67]]
                ]),
                gradientData: [
                    [0, [0, 228, 0]],
                    [50, [255, 255, 0]],
                    [150, [255, 126, 0]],
                    [250, [255, 0, 0]],
                    [350, [153, 0, 76]],
                    [420, [126, 0, 35]],
                    [10000, [88, 27, 67]]
                ]
            }
        },
        co: {
            filed: "scalar",
            type: "co",
            name: "co",
            units: [
                {
                    label: "°C",
                    conversion: function conversion(x) {
                        return x;
                    },
                    precision: 0
                }
            ],
            scale: {
                bounds: [0, 500],
                gradient: segmentedColorScale([
                    [0, [0, 228, 0]],
                    [5, [255, 255, 0]],
                    [10, [255, 126, 0]],
                    [35, [255, 0, 0]],
                    [60, [153, 0, 76]],
                    [90, [126, 0, 35]],
                    [500, [88, 27, 67]]
                ]),
                gradientData: [
                    [0, [0, 228, 0]],
                    [5, [255, 255, 0]],
                    [10, [255, 126, 0]],
                    [35, [255, 0, 0]],
                    [60, [153, 0, 76]],
                    [90, [126, 0, 35]],
                    [500, [88, 27, 67]]
                ]
            }
        },
        so2: {
            filed: "scalar",
            type: "so2",
            name: "so2",
            units: [
                {
                    label: "°C",
                    conversion: function conversion(x) {
                        return x;
                    },
                    precision: 0
                }
            ],
            scale: {
                bounds: [0, 10000],
                gradient: segmentedColorScale([
                    [0, [0, 228, 0]],
                    [150, [255, 255, 0]],
                    [500, [255, 126, 0]],
                    [650, [255, 0, 0]],
                    [800, [153, 0, 76]],
                    [1600, [126, 0, 35]],
                    [10000, [88, 27, 67]]
                ]),
                gradientData: [
                    [0, [0, 228, 0]],
                    [150, [255, 255, 0]],
                    [500, [255, 126, 0]],
                    [650, [255, 0, 0]],
                    [800, [153, 0, 76]],
                    [1600, [126, 0, 35]],
                    [10000, [88, 27, 67]]
                ]
            }
        },
        no2: {
            filed: "scalar",
            type: "no2",
            name: "no2",
            units: [
                {
                    label: "hPa",
                    conversion: function conversion(x) {
                        return x / 100;
                    },
                    precision: 0
                }
            ],
            scale: {
                bounds: [0, 10000],
                gradient: segmentedColorScale([
                    [0, [0, 228, 0]],
                    [100, [255, 255, 0]],
                    [200, [255, 126, 0]],
                    [700, [255, 0, 0]],
                    [1200, [153, 0, 76]],
                    [2340, [126, 0, 35]],
                    [10000, [88, 27, 67]]
                ]),
                gradientData: [
                    [0, [0, 228, 0]],
                    [100, [255, 255, 0]],
                    [200, [255, 126, 0]],
                    [700, [255, 0, 0]],
                    [1200, [153, 0, 76]],
                    [2340, [126, 0, 35]],
                    [10000, [88, 27, 67]]
                ]
            }
        },
        pscf: {
            filed: "scalar",
            type: "pscf",
            name: "PSCF",
            units: [
                {
                    label: "°C",
                    conversion: function conversion(x) {
                        return x;
                    },
                    precision: 0
                }
            ],
            scale: {
                bounds: [0, 0.6],
                gradient: segmentedColorScale([
                    [3, [72, 61, 139]],
                    [6, [65, 105, 225]],
                    [9, [100, 149, 237]],
                    [12, [50, 205, 50]],
                    [15, [154, 205, 50]],
                    [18, [173, 255, 47]],
                    [21, [255, 215, 0]],
                    [24, [218, 165, 32]],
                    [27, [205, 92, 92]],
                    [30, [240, 128, 128]]
                ]),
                gradientData: [
                    [3, [72, 61, 139]],
                    [6, [65, 105, 225]],
                    [9, [100, 149, 237]],
                    [12, [50, 205, 50]],
                    [15, [154, 205, 50]],
                    [18, [173, 255, 47]],
                    [21, [255, 215, 0]],
                    [24, [218, 165, 32]],
                    [27, [205, 92, 92]],
                    [30, [240, 128, 128]]
                ]
            }
        },
        cwt: {
            filed: "scalar",
            type: "cwt",
            name: "CWT",
            units: [
                {
                    label: "°C",
                    conversion: function conversion(x) {
                        return x;
                    },
                    precision: 0
                }
            ],
            scale: {
                bounds: [0, 100],
                gradient: segmentedColorScale([
                    [10, [72, 61, 139]],
                    [20, [65, 105, 225]],
                    [30, [100, 149, 237]],
                    [40, [50, 205, 50]],
                    [50, [154, 205, 50]],
                    [60, [173, 255, 47]],
                    [70, [255, 215, 0]],
                    [80, [218, 165, 32]],
                    [90, [205, 92, 92]],
                    [100, [240, 128, 128]]
                ]),
                gradientData: [
                    [10, [72, 61, 139]],
                    [20, [65, 105, 225]],
                    [30, [100, 149, 237]],
                    [40, [50, 205, 50]],
                    [50, [154, 205, 50]],
                    [60, [173, 255, 47]],
                    [70, [255, 215, 0]],
                    [80, [218, 165, 32]],
                    [90, [205, 92, 92]],
                    [100, [240, 128, 128]]
                ]
            }
        },
        o3: {
            filed: "scalar",
            type: "o3",
            name: "o3",
            units: [
                {
                    label: "mm",
                    conversion: function conversion(x) {
                        return x;
                    },
                    precision: 0
                }
            ],
            scale: {
                bounds: [0, 10000],
                gradient: segmentedColorScale([
                    [0, [0, 228, 0]],
                    [160, [255, 255, 0]],
                    [200, [255, 126, 0]],
                    [300, [255, 0, 0]],
                    [400, [153, 0, 76]],
                    [800, [126, 0, 35]],
                    [10000, [88, 27, 67]]
                ]),
                gradientData: [
                    [0, [0, 228, 0]],
                    [160, [255, 255, 0]],
                    [200, [255, 126, 0]],
                    [300, [255, 0, 0]],
                    [400, [153, 0, 76]],
                    [800, [126, 0, 35]],
                    [10000, [88, 27, 67]]
                ]
            }
        }
    };

    function Product(type) {
        return FACTORIES[type.toLowerCase()];
    }



function _instanceof(left, right) {
    if (
        right != null &&
        typeof Symbol !== "undefined" &&
        right[Symbol.hasInstance]
    ) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}

function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

/**
 * windy
 */
// import styles from '../../../styles/views/module/map.less';
var VELOCITY_SCALE = 1 / 60000; // scale for wind velocity (completely arbitrary--this value looks nice)

var OVERLAY_ALPHA = Math.floor(0.5 * 255); // overlay transparency (on scale [0, 255])

var INTENSITY_SCALE_STEP = 17; // step size of particle intensity color scale

var MAX_WIND_INTENSITY = 17; // wind velocity at which particle intensity is maximum (m/s)

var MAX_PARTICLE_AGE = 100; // max number of frames a particle is drawn before regeneration

var PARTICLE_LINE_WIDTH = 2; // line width of a drawn particle

var FRAME_RATE = 100; // desired milliseconds per frame

var NULL_WIND_VECTOR = [NaN, NaN, null]; // singleton for no wind in the form: [u, v, magnitude]

var TRANSPARENT_BLACK = [255, 0, 0, 0];


    function Windy(params) {
        _classCallCheck(this, Windy);

        this._map = params.map;
        this._windCanvas = params.windCanvas;
        this._overlayCanvas = params.overlayCanvas;
        this._maptype = params.maptype ? params.maptype : "LEAFLET"; // this._data = params.data;

        this._startcolor = params.startColor || "#2879FF";
        this._endcolor = params.endColor || "#2879FF";
        this._linewidth = PARTICLE_LINE_WIDTH;
        this._type = "wind";
        this._overlayflag = false;
        this._overlayId = params.overlayId;
        this._windId = params.windId;
        this._width = this._map.getSize().x;
        this._height = this._map.getSize().y;
        // this._chinaData = params._chinaData;
        this._verlayOutLineData = params.verlayOutLineData;
        this._windyOutLineData = params.windyOutLineData;
        // this._point = [];
        this._params = params;
        OVERLAY_ALPHA = params.alpha || OVERLAY_ALPHA;

        // for (var i in this._chinaData) {
        //     this._point[i] = []
        //     for (var item of this._chinaData[i]) {
        //         this._point[i].push(this._map.latLngToContainerPoint(L.latLng(item[1], item[0])))
        //     }
        // }
        this._bounds = [
            [0, 0],
            [this._width, this._height]
        ];
        this._windy = {
            field: null
        };
    }

    _createClass(Windy, [{
        key: "setData",
        value: function setData(data) {
            var _this = this;
            this._data = data;
            this.buildGrid(this._data, function (grid) {
                // interpolateField
                _this._grid = grid;
            });
        }
    },
    {
        key: "setCanvas",
        value: function setCanvas(ctx) {
            var point = [];
            ctx.clearRect(0, 0, this._map.getSize().x, this._map.getSize().y);
            ctx.beginPath();

            var _chinaData;
            if (ctx.canvas.id === this._windId) {
                _chinaData = this._windyOutLineData
            } else if (ctx.canvas.id === this._overlayId) {
                _chinaData = this._verlayOutLineData;
            }

            for (var i in _chinaData) {
                point[i] = [];
                if(i === 1919) {
                    console.log(_chinaData[i]);
                }
                for (var item of _chinaData[i]) {
                    point[i].push(this._map.latLngToContainerPoint(L.latLng(item[1], item[0])));
                }
            }
            for (var i in point) {
                ctx.moveTo(point[i][0].x, point[i][0].y);
                for (var j in _chinaData[i]) {
                    ctx.lineTo(point[i][j].x, point[i][j].y);
                }
            }

            ctx.closePath();
            if (!this._params.unMask) {
                var fadeFillStyle = "rgba(255, 255, 255, 0.8)"
                ctx.fillStyle = fadeFillStyle;
                ctx.fill();
            }
            var imageData = ctx.getImageData(0, 0, this._width, this._height);
            return imageData;
        }
    },
    {
        key: "setColor",
        value: function setColor(startcolor, endcolor, opacity, linewidth) {
            this._startcolor = startcolor;
            this._endcolor = endcolor;
            this._opacity = opacity;
            this._linewidth = linewidth;
        }
    },
    {
        key: "bilinearInterpolateScalar",
        value: function bilinearInterpolateScalar(x, y, g00, g10, g01, g11) {
            var rx = 1 - x;
            var ry = 1 - y;
            return g00 * rx * ry + g10 * x * ry + g01 * rx * y + g11 * x * y;
        }
    },
    {
        key: "bilinearInterpolateVector",
        value: function bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
            var rx = 1 - x;
            var ry = 1 - y;
            var a = rx * ry;
            var b = x * ry;
            var c = rx * y;
            var d = x * y;
            var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
            var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
            return [u, v, Math.sqrt(u * u + v * v)];
        }
    },
    {
        key: "createScalarBuilder",
        value: function createScalarBuilder(record) {
            var _data = record.data;
            return {
                header: record.header,
                data: function data(i) {
                    return _data[i];
                },
                interpolate: this.bilinearInterpolateScalar
            };
        }
    },
    {
        key: "createWindBuilder",
        value: function createWindBuilder(uComp, vComp) {
            var uData = uComp.data;
            var vData = vComp.data;
            return {
                header: uComp.header,
                data: function data(i) {
                    return [uData[i], vData[i]];
                },
                interpolate: this.bilinearInterpolateVector
            };
        }
    },
    {
        key: "createBuilder",
        value: function createBuilder(data) {
            var uComp = null;
            var vComp = null;
            var scalar = null;
            data.forEach(function (record) {
                switch (
                record.header.parameterCategory +
                "," +
                record.header.parameterNumber
                ) {
                    case "2,2":
                        uComp = record;
                        break;

                    case "2,3":
                        vComp = record;
                        break;

                    default:
                        scalar = record;
                }
            });
            return uComp ?
                this.createWindBuilder(uComp, vComp) :
                this.createScalarBuilder(scalar);
        }
    },
    {
        key: "buildGrid",
        value: function buildGrid(data, callback) {
            var builder = this.createBuilder(data);
            var header = builder.header;
            var λ0 = header.lo1;
            var φ0 = header.la1 > header.la2 ? header.la1 : header.la2; // the grid's origin (e.g., 0.0E, 90.0N)

            var Δλ = header.dx;
            var Δφ = header.dy;
            var ni = header.nx;
            var nj = header.ny; // number of grid points W-E and N-S (e.g., 144 x 73)

            var date = new Date(header.refTime);
            date.setHours(date.getHours() + header.forecastTime); // Scan mode 0 assumed. Longitude increases from λ0, and latitude decreases from φ0.
            // http://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_table3-4.shtml

            var grid = [];
            var p = 0;
            var isContinuous = Math.floor(ni * Δλ) >= 360;

            if (header.la1 > header.la2) {
                for (var j = 0; j < nj; j++) {
                    var row = [];

                    for (var i = 0; i < ni; i++, p++) {
                        row[i] = builder.data(p);
                    }

                    if (isContinuous) {
                        // For wrapped grids, duplicate first column as last column to simplify interpolation logic
                        row.push(row[0]);
                    }

                    grid[j] = row;
                }
            } else {
                for (var _j = nj - 1; _j >= 0; _j--) {
                    var _row = [];
                    for (var _i = 0; _i < ni; _i++, p++) {
                        _row[_i] = builder.data(p);
                    }
                    if (isContinuous) {
                        // For wrapped grids, duplicate first column as last column to simplify interpolation logic
                        _row.push(_row[0]);
                    }
                    grid[_j] = _row;
                }
            }

            function floorMod(a, n) {
                return a - n * Math.floor(a / n);
            }

            function isValue(x) {
                return x !== null && x !== undefined;
            }

            function interpolate(λ, φ) {
                var i = floorMod(λ - λ0, 360) / Δλ; // calculate longitude index in wrapped range [0, 360)

                var j = (φ0 - φ) / Δφ; // calculate latitude index in direction +90 to -90

                var fi = Math.floor(i);
                var ci = fi + 1;
                var fj = Math.floor(j);
                var cj = fj + 1;
                var row; // eslint-disable-next-line

                if ((row = grid[fj])) {
                    var g00 = row[fi];
                    var g10 = row[ci]; // eslint-disable-next-line

                    if (isValue(g00) && isValue(g10) && (row = grid[cj])) {
                        var g01 = row[fi];
                        var g11 = row[ci];

                        if (isValue(g01) && isValue(g11)) {
                            // All four points found, so interpolate the value.
                            return builder.interpolate(i - fi, j - fj, g00, g10, g01, g11);
                        }
                    }
                }

                return null;
            }

            callback({
                date: date,
                interpolate: interpolate
            });
        }
        /**
         * @returns {Boolean} true if the specified value is not null and not undefined.
         */
    },
    {
        key: "isValue",
        value: function isValue(x) {
            return x !== null && x !== undefined;
        }
        /**
         * @returns {Object} the first argument if not null and not undefined, otherwise the second argument.
         */
    },
    {
        key: "coalesce",
        value: function coalesce(a, b) {
            return this.isValue(a) ? a : b;
        }
        /**
         * @returns {Number} returns remainder of floored division, i.e., floor(a / n). Useful for consistent modulo
         *          of negative numbers. See http://en.wikipedia.org/wiki/Modulo_operation.
         */
    },
    {
        key: "floorMod",
        value: function floorMod(a, n) {
            return a - n * Math.floor(a / n);
        }
        /**
         * @returns {Number} distance between two points having the form [x, y].
         */
    },
    {
        key: "distance",
        value: function distance(a, b) {
            var Δx = b[0] - a[0];
            var Δy = b[1] - a[1];
            return Math.sqrt(Δx * Δx + Δy * Δy);
        }
        /**
         * @returns {Number} the value x clamped to the range [low, high].
         */
    },
    {
        key: "clamp",
        value: function clamp(x, range) {
            return Math.max(range[0], Math.min(x, range[1]));
        }
        /**
         * Pad number with leading zeros. Does not support fractional or negative numbers.
         */
    },
    {
        key: "zeroPad",
        value: function zeroPad(n, width) {
            var s = n.toString();
            var i = Math.max(width - s.length, 0);
            return new Array(i + 1).join("0") + s;
        }
    },
    {
        key: "buildBounds",
        value: function buildBounds(bounds, width, height) {
            var upperLeft = bounds[0];
            var lowerRight = bounds[1];
            var x = Math.round(upperLeft[0]); // Math.max(Math.floor(upperLeft[0], 0), 0);

            var y = Math.max(Math.floor(upperLeft[1], 0), 0);
            var xMax = Math.min(Math.ceil(lowerRight[0], width), width - 1);
            var yMax = Math.min(Math.ceil(lowerRight[1], height), height - 1);
            return {
                x: x,
                y: y,
                xMax: width,
                yMax: yMax,
                width: width,
                height: height
            };
        }
    },
    {
        key: "createMask",
        value: function createMask() {
            var _this2 = this;


            var ctx = this._overlayCanvas.getContext("2d");
            var imageData = this.setCanvas(ctx)
            var data = imageData.data
            //var point = [];
            //ctx.beginPath();

            //var _chinaData = this._chinaData
            //for (var i in _chinaData) {
            //    point[i] = []
            //    for (var item of _chinaData[i]) {
            //        point[i].push(this._map.latLngToContainerPoint(L.latLng(item[1], item[0])))
            //    }
            //}
            //for (var i in point) {

            //    ctx.moveTo(point[i][0].x, point[i][0].y);
            //    for (var j in _chinaData[i]) {
            //        ctx.lineTo(point[i][j].x, point[i][j].y);

            //    }
            //}

            ctx.closePath();

            ctx.fillStyle = "rgba(255, 0, 0, 0)";
            ctx.fill();
            var imageData = ctx.getImageData(0, 0, this._width, this._height);
            var data = imageData.data;
            return {
                imageData: imageData,
                set: function set(x, y, rgba) {
                    var i = (y * _this2._width + x) * 4;
                    if (data[i] !== 0 || _this2._params.unMask) {
                        data[i] = rgba[0];
                        data[i + 1] = rgba[1];
                        data[i + 2] = rgba[2];
                        data[i + 3] = rgba[3];
                    }
                }
            };
        }
    },
    {
        key: "gradient",
        value: function gradient(bounds, startcolor, endcolor, opacity) {
            var step = bounds[1] - bounds[0];
            var result = this.gradientColarRGBA(
                startcolor,
                endcolor,
                step,
                Math.floor(opacity * 255)
            );

            result.indexFor = function (m) {
                return Math.floor(
                    (Math.min(m, bounds[1]) / bounds[1]) * (result.length - 1)
                );
            };

            return result;
        }
    },
    {
        key: "interpolateField",
        value: function interpolateField(grid, bounds, scale, callback) {
            // var projection = d3.geoMercator().precision(0.1);
            var velocityScale = bounds.height * VELOCITY_SCALE;
            var columns = [];
            var point = [];
            var map = this._map;

            var mask;
            if (scale) {
                mask = this.createMask();
            }

            function invert(x) {
                //创建像素点对象实例。像素坐标的坐标原点为地图区域的左上角 像素坐标转换为经纬度坐标
                var p = map.containerPointToLatLng(L.point(x[1], x[0]))
                return [p.lng, p.lat];
            }

            function project(x) {
                var p = map.project(L.latLng(x[1], x[0]));
                p = p._subtract(map.getPixelOrigin());
                p = L.point(p).add(map._getMapPanePos());
                return [p.x, p.y];
            }
            /**
             * @returns {Boolean} true if the specified value is not null and not undefined.
             */

            function isValue(x) {
                return x !== null && x !== undefined;
            }

            function distortion(λ, φ, x, y) {
                var τ = 2 * Math.PI;
                var H = Math.pow(10, -5.2);
                var hλ = λ < 0 ? H : -H;
                var hφ = φ < 0 ? H : -H;
                var pλ = project([λ + hλ, φ]);
                var pφ = project([λ, φ + hφ]); // var pλ = projection([λ + hλ, φ]);
                // var pφ = projection([λ, φ + hφ]);
                // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1º λ
                // changes depending on φ. Without this, there is a pinching effect at the poles.

                var k = Math.cos((φ / 360) * τ);
                return [
                    (pλ[0] - x) / hλ / k,
                    (pλ[1] - y) / hλ / k,
                    (pφ[0] - x) / hφ,
                    (pφ[1] - y) / hφ
                ];
            }
            /**
             * Calculate distortion of the wind vector caused by the shape of the projection at point (x, y). The wind
             * vector is modified in place and returned by this function.
             */

            function distort(λ, φ, x, y, scales, wind) {
                var u = wind[0] * scales;
                var v = wind[1] * scales;
                var d = distortion(λ, φ, x, y); // Scale distortion vectors by u and v, then add.

                wind[0] = d[0] * u + d[2] * v;
                wind[1] = d[1] * u + d[3] * v;
                return wind;
            }

            function createField() {
                // console.log('create field');

                /**
                 * @returns {Array} wind vector [u, v, magnitude] at the point (x, y), or [NaN, NaN, null] if wind
                 *          is undefined at that point.
                 */
                function field(x, y) {
                    var column = columns[Math.round(x)];

                    return (column && column[Math.round(y)]) || NULL_WIND_VECTOR;
                } // Frees the massive "columns" array for GC. Without this, the array is leaked (in Chrome) each time a new
                // field is interpolated because the field closure's context is leaked, for reasons that defy explanation.

                field.release = function () {
                    // eslint-disable-next-line
                    columns = [];

                    if (mask && mask.imageData) {
                        mask.imageData = [];
                    }
                };

                field.randomize = function (o) {
                    // UNDONE: this method is terrible
                    var x;
                    var y;
                    var safetyNet = 0;

                    do {
                        x = Math.round(
                            Math.floor(Math.random() * bounds.width) + bounds.x
                        );
                        y = Math.round(
                            Math.floor(Math.random() * bounds.height) + bounds.y
                        );
                    } while (field(x, y)[2] === null && safetyNet++ < 30);

                    o.x = x;
                    o.y = y;
                    return o;
                };

                if (scale) {
                    field.overlay = mask.imageData;
                } // return field;

                callback(bounds, field);
            }

            var xx = bounds.x;

            (function batchInterpolate() {
                try {
                    // let start = Date.now();
                    while (xx < bounds.width) {
                        var column = [];

                        for (var y = bounds.y; y <= bounds.yMax; y += 2) {
                            point[1] = xx;
                            point[0] = y;
                            var coord = invert(point);
                            var color = TRANSPARENT_BLACK;

                            if (coord) {
                                var λ = coord[0]; // lng

                                var φ = coord[1]; // lat

                                var scalar = void 0;

                                if (isFinite(λ)) {
                                    var value = grid.interpolate(λ, φ);

                                    if (value && value[2]) {
                                        // 风
                                        var wind = distort(
                                            λ,
                                            φ,
                                            xx,
                                            y,
                                            velocityScale,
                                            value
                                        );
                                        column[y + 1] = column[y] = wind;
                                        scalar = wind[2];
                                    } else {
                                        scalar = value;
                                    }

                                    var alpha = OVERLAY_ALPHA;
                                    if (scalar < 0) {
                                        alpha = Math.floor(0 * 255);
                                    }
                                    if (scale && isValue(scalar)) {
                                        color = scale.gradient(scalar, alpha);
                                        mask.set(xx, y, color);
                                        mask.set(xx + 1, y, color);
                                        mask.set(xx, y + 1, color);
                                        mask.set(xx + 1, y + 1, color);
                                    }
                                }
                            }
                        }

                        columns[xx + 1] = columns[xx] = column;
                        xx += 2; // if ((Date.now() - start) > 1200) { // MAX_TASK_TIME) {
                        //   // Interpolation is taking too long. Schedule the next batch for later and yield.
                        //   // report.progress((x - bounds.x) / (bounds.xMax - bounds.x));
                        //   console.log('timeout', Date.now() - start);
                        //   // xx = bounds.x;
                        //   setTimeout(() => batchInterpolate(), 20);
                        //   return;
                        // }
                    }

                    createField();
                } catch (e) {
                    console.log("error in batch interp", e);
                }
            })();
        }
    },
    {
        key: "animate",
        value: function animate(bounds, field) {
            let _this = this
            var maplevel =
                arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
            var that =
                arguments.length > 3 && arguments[3] !== undefined ?
                    arguments[3] :
                    this;

            function asColorStyle(r, g, b, a) {
                return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
            }

            var framerate = FRAME_RATE;
            var opacity = 0.8;
            var particlemultiplier = 10;
            var k = 1;
            var linewidth = that._linewidth;

            if (maplevel <= 3) {
                opacity = 0.8;
                framerate = 60;
                particlemultiplier = 10;
                k = 1.2;
                linewidth = 1.5;
            } else if (maplevel === 4) {
                opacity = 0.8;
                framerate = 60;
                particlemultiplier = 10;
                k = 1.1;
                linewidth = 1.5;
            } else if (maplevel === 5) {
                opacity = 0.8;
                framerate = 75;
                particlemultiplier = 10;
                k = 1;
                linewidth = 1.6;
            } else if (maplevel === 6) {
                opacity = 0.7;
                framerate = 75;
                particlemultiplier = 8;
                k = 0.8;
                linewidth = 1.8;
            } else if (maplevel === 7) {
                opacity = 0.65;
                framerate = 75;
                particlemultiplier = 6;
                k = 0.6;
                linewidth = 1.8;
            } else if (maplevel === 8) {
                opacity = 0.6;
                framerate = 80;
                particlemultiplier = 4;
                k = 0.5;
                linewidth = 1.8;
            } else if (maplevel === 9) {
                opacity = 0.55;
                framerate = 80;
                particlemultiplier = 3;
                k = 0.4;
                linewidth = 2;
            } else if (maplevel === 10) {
                opacity = 0.5;
                framerate = 80;
                particlemultiplier = 2;
                k = 0.3;
                linewidth = 2;
            } else if (maplevel === 11) {
                opacity = 0.4;
                framerate = 100;
                particlemultiplier = 1;
                k = 0.2;
                linewidth = 2.2;
            } else if (maplevel === 12) {
                opacity = 0.3;
                framerate = 100;
                particlemultiplier = 0.8;
                k = 0.1;
                linewidth = 2.3;
            } else if (maplevel === 13) {
                opacity = 0.2;
                k = 0.08;
                linewidth = 2.5;
            } else {
                opacity = 0.1;
                framerate = 120;
                particlemultiplier = 0.5;
                k = 0.05;
                linewidth = 2.6;
            }

            console.log(
                "地图级别:",
                maplevel,
                " 风场透明度:",
                opacity,
                " 风场帧率:",
                framerate,
                " 放大系数:",
                particlemultiplier,
                "风速系数:",
                k,
                "线宽:",
                linewidth
            );

            function windIntensityColorScale(step, maxWind) {
                // const result = [];
                if (that._opacity) {
                    opacity = that._opacity;
                }

                var startcolor = that._startcolor;
                var endcolor = that._endcolor;

                var result = _this.gradientColor(startcolor, endcolor, step, opacity);

                result.indexFor = function (m) {
                    return Math.floor(
                        (Math.min(m, maxWind) / maxWind) * (result.length - 1)
                    );
                };

                return result;
            }

            var colorStyles = windIntensityColorScale(
                INTENSITY_SCALE_STEP,
                MAX_WIND_INTENSITY
            );
            var buckets = colorStyles.map(function () {
                return [];
            });
            var width = bounds.width < 1200 ? bounds.width : 1200;
            var particleCount = Math.round(
                bounds.width * particlemultiplier * 0.25
            ); // console.log(maplevel, particleCount);

            var fadeFillStyle = "rgba(255, 255, 255, 0.8)"; // const fadeFillStyle = 'rgba(255, 255, 0, 0.97)';

            var particles = [];

            for (var _i2 = 0; _i2 < particleCount; _i2++) {
                particles.push(
                    field.randomize({
                        age: Math.floor(Math.random() * MAX_PARTICLE_AGE) + 0
                    })
                );
            }

            function evolve() {
                buckets.forEach(function (bucket) {
                    bucket.length = 0;
                });

                particles.forEach(function (particle) {
                    if (particle.age > MAX_PARTICLE_AGE) {
                        field.randomize(particle).age = 0;
                    }

                    var x = particle.x;
                    var y = particle.y;
                    var v = field(x, y); // vector at current position

                    var m = v[2];

                    if (m === null) {
                        particle.age = MAX_PARTICLE_AGE; // particle has escaped the grid, never to return...
                    } else {
                        var xt = x + k * v[0];
                        var yt = y + k * v[1];

                        if (field(xt, yt)[2] !== null) {
                            // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.

                            particle.xt = xt;
                            particle.yt = yt;
                            buckets[colorStyles.indexFor(m)].push(particle);

                        } else {
                            // Particle isn't visible, but it still moves through the field.
                            particle.x = xt;
                            particle.y = yt;
                        }
                    }

                    particle.age += 1;
                });
            }

            var g = this._windCanvas.getContext("2d");
            var imageData = this.setCanvas(g)
            var data = imageData.data

            //     var point = [];
            //      g.beginPath();

            //    var _chinaData = this._chinaData
            //    for (var i in _chinaData) {
            //        point[i] = []
            //         for (var item of _chinaData[i]) {
            //             point[i].push(this._map.latLngToContainerPoint(L.latLng(item[1], item[0])))
            //         }
            //}
            //      for (var i in point) {
            //          g.moveTo(point[i][0].x, point[i][0].y);
            //          for (var j in _chinaData[i]) {
            //             g.lineTo(point[i][j].x, point[i][j].y);
            //         }
            //     }

            //      g.closePath();
            //     g.fillStyle = fadeFillStyle; // g.fillStyle = "rgba(255, 0, 0, 255)";


            //    g.fill();
            //   var imageData = g.getImageData(
            //       bounds.x,
            //       bounds.y,
            //      bounds.width,
            //       bounds.height
            //  );
            //   var data = imageData.data;
            g.lineWidth = linewidth;
            var _width = this._width;

            function draw() {
                // Fade existing particle trails.
                var prev = g.globalCompositeOperation;
                g.globalCompositeOperation = "destination-in";
                g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
                g.globalCompositeOperation = prev; // console.log("bucket",data)
                // Draw new particle trails.

                buckets.forEach(function (bucket, i) {
                    if (bucket.length > 0) {
                        g.beginPath();
                        g.strokeStyle = colorStyles[i];
                        bucket.forEach(function (particle) {
                            var i = (particle.y * _width + particle.x) * 4;
                            if (data[i] !== 0) {
                                g.moveTo(particle.x, particle.y);
                                g.lineTo(particle.xt, particle.yt);
                                particle.x = particle.xt;
                                particle.y = particle.yt;
                            }
                        });
                        g.stroke();
                    }
                });
            }

            (function frame() {
                try {
                    var flag = draw();
                    evolve();
                    if (that._windflag) {
                        that._time = setTimeout(frame, framerate);
                    } else {
                        console.log("释放内存");
                        particles = [];
                        buckets = [];
                    } // console.log(Date.parse(new Date()));
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    },
    {
        key: "start",
        value: function start(bounds, width, height) {
            var _this3 = this;

            console.log("start", this._bounds, this._width, this._height);
            this._bounds = bounds;
            this._width = width;
            this._height = height;
            this.stop();
            this._windflag = true;

            if (this._grid) {
                var windproduct = false;

                if (this._type === "wind" && this._overlayflag === true) {
                    windproduct = Product(this._type);
                } // eslint-disable-next-line

                this.interpolateField(
                    this._grid,
                    this.buildBounds(bounds, width, height),
                    windproduct.scale,
                    function (bounds, field) {
                        // animate the canvas with random points
                        _this3._windy.field = field;

                        if (windproduct) {
                            var ctx = _this3._overlayCanvas.getContext("2d");

                            ctx.putImageData(field.overlay, 0, 0);
                        }

                        _this3.animate(bounds, field, _this3._map.getZoom());
                    }
                );
            }

            setTimeout(this.drawOverlay(), 20);
        }
    },
    {
        key: "stop",
        value: function stop() {
            this._windflag = false;

            if (this._windy.field) {
                this._windy.field.release();

                if (this._time) {
                    clearTimeout(this._time);
                }
            }
        }
    },
    {
        key: "setOverlay",
        value: function setOverlay(type, data) {
            this._overlayData = data;
            this._type = type !== undefined ? type : "wind";

            if (data) {
                this._overlayflag = true;
                this._overlayProduct = Product(type);
                this.drawOverlay();
            } else {
                this._overlayflag = false;
                this.releaseOverlay();
            }
        }
    },
    {
        key: "drawOverlay",
        value: function drawOverlay() {
            var _this4 = this;

            if (this._overlayData) {
                this.buildGrid(this._overlayData, function (grid) {
                    _this4._overlayGrid = grid;

                    _this4.interpolateField(
                        grid,
                        _this4.buildBounds(_this4._bounds, _this4._width, _this4._height),
                        _this4._overlayProduct.scale,
                        function (bounds, field) {
                            _this4._windy.overlayfield = field;
                            var ctx = _this4._overlayCanvas.getContext("2d");
                            ctx.putImageData(field.overlay, 0, 0);
                        }
                    );
                });
            }
        }
    },
    {
        key: "releaseOverlay",
        value: function releaseOverlay() {
            if (this._windy.overlayfield) {
                this._windy.overlayfield.release();
            }
            this._overlayData = undefined;
        }
    },
    {
        key: 'changeWindyOutLineData',
        value: function changeWindyOutLineData(data) {
            if(data && data.length) {
                this._windyOutLineData = data
            }
        }
    },
        {
            // startColor：开始颜色hex
            // endColor：结束颜色hex
            // step:几个阶级（几步）
            key: 'gradientColarRGBA',
            value: function GradientColarRGBA(startColor, endColor, step, opacity = 1) {
                var  startRGB = this.colorRgb(startColor); // 转换为rgb数组模式
                var  startR = startRGB[0];
                var  startG = startRGB[1];
                var  startB = startRGB[2];

                var  endRGB = this.colorRgb(endColor);
                var  endR = endRGB[0];
                var  endG = endRGB[1];
                var  endB = endRGB[2];

                var  sR = (endR - startR) / step; // 总差值
                var  sG = (endG - startG) / step;
                var  sB = (endB - startB) / step;

                var  colorArr = [];
                for (let i = 0; i < step; i++) {
                    // 计算每一步的hex值
                    // eslint-disable-next-line radix
                    // var  hex = this.colorHex('rgba(' + parseInt(((sR * i) + startR)) + ',' + parseInt(((sG * i) + startG)) + ',' + parseInt(((sB * i) + startB)) + ',' + opacity + ')');
                    var  hex = [parseInt(((sR * i) + startR), 10), parseInt(((sG * i) + startG), 10), parseInt(((sB * i) + startB), 10), opacity];
                    colorArr.push(hex);
                }
                return colorArr;
            }
        },
        {
            key: 'colorHex',
            value: function ColorHex(rgb) {
                var  _this = rgb;
                var  reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                if (/^(rgb|RGB)/.test(_this)) {
                    var  aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, '').split(',');
                    var  strHex = '#';
                    for (let i = 0; i < aColor.length; i++) {
                        var  hex = Number(aColor[i]).toString(16);
                        hex = hex < 10 ? 0 + '' + hex : hex; // 保证每个rgb的值为2位
                        if (hex === '0') {
                            hex += hex;
                        }
                        strHex += hex;
                    }
                    if (strHex.length !== 7) {
                        strHex = _this;
                    }
                    return strHex;
                } else if (reg.test(_this)) {
                    var  aNum = _this.replace(/#/, '').split('');
                    if (aNum.length === 6) {
                        return _this;
                    } else if (aNum.length === 3) {
                        var  numHex = '#';
                        for (let i = 0; i < aNum.length; i += 1) {
                            numHex += (aNum[i] + aNum[i]);
                        }
                        return numHex;
                    }
                } else {
                    return _this;
                }
            }
        },
        {
            key: 'colorRgb',
            value: function  ColorRgb(sColor) {
                var  reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                sColor = sColor.toLowerCase();
                if (sColor && reg.test(sColor)) {
                    if (sColor.length === 4) {
                        var  sColorNew = '#';
                        for (let i = 1; i < 4; i += 1) {
                            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                        }
                        sColor = sColorNew;
                    }
                    // 处理六位的颜色值
                    var  sColorChange = [];
                    for (let i = 1; i < 7; i += 2) {
                        // eslint-disable-next-line radix
                        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
                    }
                    return sColorChange;
                }
                return sColor;
            }
        },
        {
            key: 'gradientColor',
            value: function GradientColor(startColor, endColor, step, opacity = 1) {
                var  colorArr = this.gradientColarRGBA(startColor, endColor, step, opacity);
                var  result = [];
                for (let i = 0; i < step; i++) {
                    // 计算每一步的hex值
                    // eslint-disable-next-line radix
                    var  hex = this.colorHex('rgba(' + colorArr[i][0] + ',' + colorArr[i][1] + ',' + colorArr[i][2] + ',' + opacity + ')');
                    result.push(hex);
                }
                return result;
            }
        }
    ]);

    return Windy;
})();