
import Plotly from 'plotly.js-dist-min'

import _ from 'lodash'

const Grain = function (options) {
    this.options = {
        data: [],
        container: 'chart_grain',
        maxParticleSize: 1000000,
        config: {
            'title': '',
            'hovermode': 'closest',
            'yaxis': {
                'title': 'P/cm3'
            },
            'xaxis': {
                'type': 'date',
                'tickformat': '%x<br>%X',
                'title': ''
            }
        },
        colors: [
            [
                0,
                '#ffffcc'
            ],
            [
                0.125,
                '#ffeda0'
            ],
            [
                0.25,
                '#fed976'
            ],
            [
                0.375,
                '#feb24c'
            ],
            [
                0.5,
                '#fd8d3c'
            ],
            [
                0.625,
                '#fc4e2a'
            ],
            [
                0.75,
                '#e31a1c'
            ],
            [
                0.875,
                '#bd0026'
            ],
            [
                1,
                '#800026'
            ]
        ],
        config2: {
            'displaylogo': false,
            'modeBarButtonsToRemove': ['sendDataToCloud']
        },
        shapes: {
            visible: true,
            layer: 'above',
            opacity: 1,
            line: {
                color: '#ffffff',
                width: 2,
                dash: 'solid'
            },
            type: 'line',
            xsizemode: 'scaled',
            ysizemode: 'scaled',
            xref: 'x',
            x0: new Date().getTime(),
            x1: new Date().getTime(),
            yref: 'y',
            y0: 0,
            y1: 1000000
        }
    }

    this.options = _.defaultsDeep(_.cloneDeep(options), this.options)
    this.data = this.options.data
    this.container = this.options.container
}
Grain.prototype.init = function () {
    this.dataProcess()
    this.render()
    this.bindEvent()
}

Grain.prototype.dataProcess = function () {
    this.data[0].colorscale = this.options.colors
}

Grain.prototype.drawLine = function (time) {
    this.options.shapes.x0 = time
    this.options.shapes.x1 = time

    const shapes = [this.options.shapes]

    Plotly.relayout(this.container, {shapes: shapes})
}

Grain.prototype.render = function () {
    Plotly.newPlot(this.container, this.data, this.options.config, this.options.config2)
}

Grain.prototype.bindEvent = function () {
    const _this = this

    document.querySelector('#' + this.container).on('plotly_click', data => {
        _this.drawLine(data.points[0].data.x[data.points[0].pointIndex[1]], data.points[0].data.y[data.points[0].pointIndex[0]])
    })
}

export default Grain
