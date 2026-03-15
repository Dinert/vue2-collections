
import {Notification} from 'element-ui'

export const notify = (options = {}) => {
    const defaultOptions = {
        duration: 3000
    }
    const newOptions = _.defaultsDeep(_.cloneDeep(options), defaultOptions)
    Notification(newOptions)
}


export const notifySuccess = (options = {}) => {
    notify({
        ...options,
        type: 'success',
    })
}
