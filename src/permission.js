import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    document.title = '炫酷的演示平台'
    next()
})


router.afterEach(() => {
    NProgress.done()
})
