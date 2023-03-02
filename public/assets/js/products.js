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

