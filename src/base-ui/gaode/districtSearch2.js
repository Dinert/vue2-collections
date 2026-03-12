import _ from 'lodash'

const districtSearch = async function (options = {}) {

    const defaultOptions = {
        subdistrict: 1,
        extensions: 'all',
        // level: 'country'
    }

    const newOptions = _.defaultsDeep({}, options, defaultOptions)

    const district = new AMap.DistrictSearch(newOptions)

    const masks = typeof newOptions.mask === 'string'
        ? [newOptions.mask]
        : (newOptions.mask || [])

    const searchFn = name => {
        return new Promise(resolve => {
            district.search(name, (status, result) => {
                if (status === 'complete') {

                    const districtItem = result.districtList?.[0]
                    resolve({
                        name,
                        boundaries: districtItem?.boundaries || [],
                        content: districtItem,
                        success: true
                    })

                } else {

                    console.log(name, '查询失败')

                    resolve({
                        name,
                        boundaries: [],
                        content: null,
                        success: false,
                        message: `${name} 查询失败`
                    })

                }
            })
        })
    }

    // 并发池
    const runWithLimit = async (list, limit = 5) => {

        const results = []
        const executing = []

        for (const item of list) {

            const p = searchFn(item).then(res => {
                results.push(res)
                executing.splice(executing.indexOf(p), 1)
            })

            executing.push(p)

            if (executing.length >= limit) {
                await Promise.race(executing)
            }
        }

        await Promise.all(executing)

        return results
    }

    // ⭐ 使用并发控制
    const results = await runWithLimit(masks, 7)

    const mask = []
    const bounds = []
    const outLine = []
    const contents = []
    const strokePaths = []
    const failed = []

    results.forEach(item => {

        if (!item.success) {
            failed.push(item.name)
            return
        }

        item.boundaries.forEach(path => {
            mask.push([path])
            bounds.push(path)
            strokePaths.push(path)
        })

        outLine.push(item.boundaries)
        contents.push(item.content)

    })

    return {
        mask,
        bounds,
        outLine,
        contents,
        strokePaths,
        failed
    }
}

export default districtSearch
