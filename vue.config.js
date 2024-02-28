const {defineConfig} = require('@vue/cli-service')
const path = require('path')
const HappyPack = require('happypack')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = defineConfig({
    publicPath: process.env.NODE_ENV !== 'development' ? './' : '/',
    transpileDependencies: true,
    lintOnSave: false,
    productionSourceMap: false,
    css: {
        loaderOptions: {
            // 解决scss :export为空的情况
            css: {
                modules: {
                    mode: 'icss',
                },
            },
            sass: {
                // 解决文件中再引入var.scss会抛错
                additionalData: (content, loaderContext) => {
                    const {resourcePath} = loaderContext
                    // eslint-disable-next-line max-statements-per-line
                    if (resourcePath.endsWith('index.scss')) {return content}
                    return `@import "@/assets/scss/variables/index.scss"; ${content}`
                },
            },
        },
    },
    devServer: {
        port: 8099,
        proxy: {
            '/zwjd-system': {
                target: 'http://develop.iot-cas.com:8081/zwjd-system',
                changeOrigin: true,
                pathRewrite: {
                    ['^' + '/zwjd-system']: '',
                },
            },
        },
    },
    chainWebpack(config) {
    // when there are many pages, it will cause too many meaningless requests
        config.plugins.delete('prefetch')

        config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()

        config.plugin('happypack').use(HappyPack, [{
            id: 'happybabel',
            loaders: ['babel-loader?cacheDirectory'],
            // 开启 4 个线程
            threads: 4
        }])


        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader?id=happybabel')
            .options({
                symbolId: 'icon-[name]',
            })
            .end()

        config.when(process.env.NODE_ENV !== 'development',
            config => {
                config
                    .optimization.splitChunks({
                        chunks: 'all',
                        cacheGroups: {
                            libs: {
                                name: 'chunk-libs',
                                test: /[\\/]node_modules[\\/]/,
                                priority: 10,
                                chunks: 'initial' // only package third parties that are initially dependent
                            },
                            elementUI: {
                                name: 'chunk-elementUI', // split elementUI into a single package
                                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                            },
                            commonsBaseUi: {
                                name: 'chunk-commons-base-ui',
                                test: resolve('src/base-ui'), // can customize your rules
                                minChunks: 3, //  minimum common number
                                priority: 5,
                                reuseExistingChunk: true
                            },
                            commonsComponents: {
                                name: 'chunk-commons-Components',
                                test: resolve('src/components'), // can customize your rules
                                minChunks: 3, //  minimum common number
                                priority: 3,
                                reuseExistingChunk: true
                            }
                        }
                    })
                // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
                config.optimization.runtimeChunk('single')
            })
    },
})
