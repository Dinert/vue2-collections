// 千位小数
export const wFormatInt = num => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : num
}