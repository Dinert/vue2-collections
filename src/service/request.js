import axios from 'axios'
import {ElMessage, ElLoading} from 'element-ui'
import {storage} from '@/utils'
import router from '../router'

const instance = axios.create({
    baseURL: '/zwjd-system',
    timeout: 10000
})

// 收集请求依赖
const loadingArr = []
let loading

// 错误的处理方式
const errorHandle = data => {
    if (Number(data.code) === 0 && ['A0200', 'A0001', 'A0201', 'A0210', 'A0220', 'A0300', 'A0301'].includes(data.status)) {
        ElMessage({
            message: data.msg,
            type: 'error'
        })
        if (data.msg === '用户凭证已过期！') {
            storage('localStorage', 'clear', 'zwjd-token')
            router.push('/login')
        }
    } else if (data.code === 'ECONNABORTED') {
        ElMessage({
            message: '请求超时',
            type: 'error'
        })
    }
}

// 请求拦截器
instance.interceptors.request.use(config => {

    // 加载条
    config.loading = config.loading || {}
    config.loading = JSON.stringify(config.loading) === '{}' ? true : config.loading
    if (loadingArr && loadingArr.length === 0 && config.loading) {
        loading = ElLoading.service({
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.2)',
            ...config.loading
        })
    }

    // 等于post请求时的处理
    if (config.method.toLocaleLowerCase() === 'post') {
        config.headers.hideNotify = true
    }
    const token = storage('localStorage', 'zwjd-token')

    if (token && token.token) {
        config.headers.Authorization = token.token
    }

    loadingArr.push(config)
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(response => {
    const data = response.data

    // 去除加载动画
    loadingArr.pop()
    if (loadingArr && loadingArr.length === 0) {
        loading && loading.close && loading.close()
    }
    errorHandle(data)

    return data && data.data
}, error => {

    errorHandle(error)
    // 去除加载动画
    loadingArr.pop()
    if (loadingArr && loadingArr.length === 0) {
        loading && loading.close && loading.close()
    }

    return Promise.reject(error)
})

const request = config => {
    return instance.request(config)
}

export default request
