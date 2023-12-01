import {filterNullStrUndefind} from '@dinert/element-ui'
import {isEqual, isEmpty, cloneDeep} from 'lodash'
import {dataTransformRod, ImageIdTransUrl, handleAmount} from '@/utils/transformData'

export default {
    components: {
    },
    created() {
        if (this.tableId) {
            this.getTableSortData()
        }
        this.resetParams()
        this.resetPagination()
    },

    data() {
        return {
            // 需要提交的参数
            params: {},

            // 上一次的提交参数
            oldParams: {},

            // 表格
            table: {
                errData: '-',
                tableColumn: [],
                data: [],
                on: {
                    'selection-change': data => {
                        this.selectTableData = data
                    }
                },
            },

            // 默认分页
            defaultPagination: {
                total: 17,
                pageSize: 20,
                pageSizes: [10, 20, 30, 50, 100],
                currentPage: 1,
            },

            // 分页
            pagination: {

            },

            // 选中的表格数据
            selectTableData: [],

            // 是否禁用
            isDisabled: false,

            // 查询的参数
            searchForm: {
                model: {},
            },

            // 默认的查询参数
            defaultSearchForm: {
                model: {}
            },

            // 查询栏的对象
            searchFormItem: {},

            // 表格排序参数
            tableId: ''
        }
    },
    computed: {
        isSelectTable() {
            return this.selectTableData.length === 0
        }
    },
    methods: {
        filterNullStrUndefind, // 过滤 '' null undefined
        isEqual, // 判断两个对象的值是否相等
        dataTransformRod,
        ImageIdTransUrl,
        handleAmount,
        cloneDeep,

        filterTableParams(params) {
            const result = {}
            for (const prop in params) {
                if (![null, undefined, ''].includes(params[prop])) {
                    result[prop] = params[prop]
                }
            }
            return result
        },

        // 请求表格数据
        // eslint-disable-next-line max-statements
        ajaxTableData(options = {}) {
            this.params = this.getTableParams(options)

            const isSame = this.isEqual(this.params, this.oldParams) // 判断当前提交的参数和上一次提交的参数是否相同
            options.isSame = isSame
            // 在查询按钮点击时才走当前提交的参数和上一次提交的参数是否相同
            if (options.name === '查询') {
                if (!isSame) {
                    this.pagination.currentPage = 1
                    this.params = this.getTableParams(options)
                }
                this.oldParams = {...this.params}
            } else if (options.name === '重置') {
                this.resetPagination()
                this.params = this.getTableParams(options)
                this.oldParams = {...this.params}

            } else if (options.name === '删除') {
                if (this.table.data && this.table.data.length) {
                    if (this.table.data.length === 1 && this.pagination.currentPage > 1) {
                        this.pagination.currentPage = this.pagination.currentPage - 1
                        this.params = this.getTableParams(options)
                    }
                }
            } else if (options.name === 'current') {
                if (this.oldParams.data && this.oldParams.data.pageNum) {
                    this.oldParams.data.pageNum = options.value
                } else if (this.oldParams.data && this.oldParams.data.page) {
                    this.oldParams.data.page = options.value
                } else if (this.oldParams.params && this.oldParams.params.page) {
                    this.oldParams.params.page = options.value
                } else if (this.oldParams.params && this.oldParams.params.pageNum) {
                    this.oldParams.params.pageNum = options.value
                }

                if (this.oldParams.data && this.oldParams.data.pageSize) {
                    this.oldParams.data.pageSize = this.pagination.pageSize
                } else if (this.oldParams.params && this.oldParams.params.pageSize) {
                    this.oldParams.params.pageSize = this.pagination.pageSize
                }

                this.params = {...this.oldParams}
            } else if (options.name === 'size') {
                if (this.oldParams.data && this.oldParams.data.pageSize) {
                    this.oldParams.data.pageSize = options.value
                } else if (this.oldParams.params && this.oldParams.params.pageSize) {
                    this.oldParams.params.pageSize = options.value
                }
                this.params = {...this.oldParams}
            } else {
                this.params = {...this.oldParams}
            }

            const newParams = _.cloneDeep(this.params)
            if (newParams && newParams.headers && !newParams.headers.loading) {
                newParams.headers.loading = {
                    target: '.d-table-page' + ' .' + this.table.onlyClass,
                    background: 'rgba(255, 255, 255, .9)'
                }
            }

            if (this.$Api() && this.$Api()[newParams.headers.controller] && this.$Api()[newParams.headers.controller][newParams.headers.controllerName]) {
                return this.$Api()[newParams.headers.controller][newParams.headers.controllerName].request(newParams)
            } else {
                return request(newParams)
            }
        },

        // 获取表格数据
        async getTableData(options) {
            const res = await this.ajaxTableData(options)
            this.changeTableData(res)
            this.checkboxBug()
            this.table.key = !this.table.key

            // 表格数据请求完成的回调
            typeof this.ajaxTableDataAfter === 'function'
        && this.ajaxTableDataAfter(res, options)
            return res
        },

        // 改变表格的数据
        changeTableData(res) {
            res.data = res.data || res.content
            for (let i = 0; i < res.data.length; i++) {
                res.data[i].index = i + 1 + res.pageNum * res.pageSize
            }
            this.table.data = res.data

            this.pagination.total = res.total
        },

        // 请求表格排序
        async ajaxTableSort(options) {
            const res = await this.$Api().UserCommonCacheController.get_cache.request({
                path: {type: 'tableIndex_' + this.tableId},
                ...options
            })
            return res
        },

        // 获取表格排序数据
        async getTableSortData(options) {
            const res = await this.ajaxTableSort(options)
            if (res.content) {
                this.changeTableSortData(res)
            }
        },

        // 改变表格排序数据
        changeTableSortData(res) {
            const tableColumn = res.content.tableIndex
            const resultSort = []
            tableColumn.forEach(item => {
                resultSort.push(item.id)
            })

            this.table.tableColumn.sort((a, b) => {
                if (resultSort.indexOf(a.prop) === -1 || resultSort.indexOf(b.prop) === -1) {
                    return 0
                }
                return resultSort.indexOf(a.prop) - resultSort.indexOf(b.prop)
            })
            for (let i = 0; i < this.table.tableColumn.length; i++) {
                if (tableColumn[i] !== undefined) {
                    this.$set(this.table.tableColumn[i].checkbox, 'checked', tableColumn[i].checked)
                }
            }

            this.table.key = !this.table.key
        },

        // 拖拽完成
        async dragEnd(event, tableColumn) {
            const tableIndex = []
            tableColumn.forEach(item => {
                if (item.prop !== 'operations') {
                    tableIndex.push({id: item.prop, checked: item.checkbox.checked})
                }
            })
            if (!this.tableId) {
                return
            }

            await this.$Api().UserCommonCacheController.post_cache.request({
                data: {
                    type: 'tableIndex_' + this.tableId,
                    content: {
                        tableIndex
                    }
                },
                headers: {
                    hideNotify: true,
                    hideLoading: true
                }
            })
        },

        // 选择筛选列时的改变
        async checkboxChange(checked, column, tableColumn) {
            const tableIndex = []
            tableColumn.forEach(item => {
                if (item.prop !== 'operations' && item.prop !== 'index' && item.prop !== 'selection') {
                    tableIndex.push({id: item.prop, checked: item.checkbox.checked})
                }
            })

            if (!this.tableId) {
                return
            }

            await this.$Api().UserCommonCacheController.post_cache.request({
                data: {
                    type: 'tableIndex_' + this.tableId,
                    content: {
                        tableIndex
                    }
                },
                headers: {
                    hideNotify: true,
                    hideLoading: true
                }
            })
        },


        // 重置表格请求的参数
        resetParams() {

            if (isEmpty(this.defaultSearchForm.model)) { // 判断查询的默认参数是否为空，如果为空则重置查询参数为''
                for (const prop in this.searchForm.model) {
                    this.searchForm.model[prop] = ''
                }
            } else {
                for (const prop in this.defaultSearchForm.model) {
                    this.$set(this.searchForm.model, prop, this.defaultSearchForm.model[prop])
                }
            }

        },

        // 清空参数
        clearParams() {
            for (const prop in this.model) {
                this.model[prop] = ''
            }
        },

        // 重置分页参数
        resetPagination() {
            for (const prop in this.defaultPagination) {
                this.pagination[prop] = this.defaultPagination[prop]
            }
        },

        // 查询
        search(options) {
            return this.getTableData(options)
        },

        // 查询重置
        resetSearch(options) {
            this.resetParams()
            this.search(options)
        },

        // 切换页数
        currentChange(value) {
            this.pagination.currentPage = value
            this.search({name: 'current', value})
        },

        // 切换每页条数
        sizeChange(value) {
            const pageSize = this.pagination.pageSize
            this.pagination.pageSize = value
            if (pageSize > value
                || this.pagination.currentPage <= Math.ceil(this.pagination.total / this.pagination.pageSize)) {
                this.search({name: 'size', value})
            }
        },

        // 获取选中的id
        getTableIds(key = 'id') {
            const result = []
            this.selectTableData.forEach(item => {
                result.push(item[key])
            })
            return result
        },

        checkboxBug() {
            this.selectTableData = [{}]
            setTimeout(() => {
                this.selectTableData = []
            }, 1)
        }
    }
}
