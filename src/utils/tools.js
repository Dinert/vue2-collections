import _ from 'lodash'

// 千位小数
export const wFormatInt = num => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : num
}

export const resize = (resize, delay = 0, immediate = false) => {
    if (typeof resize === 'function') {
      window.addEventListener('resize', _.debounce(resize, delay), immediate)
      resize()
    }
  }