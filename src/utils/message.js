import {Message} from 'element-ui'

export const message = (options = {}) => {
    Message({
        duration: 3000,
        ...options,
    })
}

export const messageSuccess = (options = {}) => {
    message({
        ...options,
        type: 'success',
    })
}

export const messageError = (options = {}) => {
    message({
        ...options,
        type: 'error',
    })
}
