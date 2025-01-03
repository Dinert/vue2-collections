export function loadBMap(ak) {
    return new Promise((resolve, reject) => {
        if (typeof BMap !== 'undefined') {
            resolve(BMap)
            return true
        }
        window.onBMapCallback = function () {
            resolve(BMap)
        }
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src
            = 'https://api.map.baidu.com/api?v=2.0&ak=' + ak + '&__ec_v__=20190126&callback=onBMapCallback'
        script.onerror = reject
        document.head.appendChild(script)
    })
}
