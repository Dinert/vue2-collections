<template>
    <div class="customTable">
        <el-button @click="() => {
            table.data = table.data.length === 17 ? table.data.slice(0, 5) : tableData1
            table.key = !table.key
        }"
        >切换表格数据</el-button>
        <div class="customTable-table">
            <dinert-table-page
                :table="table"
                :form="form"
            >
                <template #column_heartApi>
                    33
                </template>

                <template #column_name1>
                    <el-dropdown split-button type="primary">
                        默认尺寸
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>黄金糕</el-dropdown-item>
                            <el-dropdown-item>狮子头</el-dropdown-item>
                            <el-dropdown-item>螺蛳粉</el-dropdown-item>
                            <el-dropdown-item>双皮奶</el-dropdown-item>
                            <el-dropdown-item>蚵仔煎</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
                <template #column_name2>
                    name2
                </template>
            <!-- <template #column_header_heartApi="scope">
                <el-input/>
            </template> -->
            </dinert-table-page>
        </div>
    </div>
</template>

<script>
// import TablePageMixins from '@/mixins/TablePage'
const tableData1 = [{'api': 'www.baidu.com', 'deleted': false, 'departmentCode': '1-', 'description': '测试', 'heartApi': 'www.baidu.com', 'id': '10026', 'name': '测试服务', 'scope': '0', 'serviceStatus': '1', 'updateTime': '2023-04-13 16:22:50', 'updateUserName': '超级管理员', 'scope_detail': '不公开', 'serviceStatus_detail': '正常', 'index': 21}, {'api': '123', 'deleted': false, 'departmentCode': '1-', 'description': '123', 'heartApi': '123', 'id': '10025', 'name': '立码报打卡', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-04-13 11:37:56', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 22}, {'api': '12', 'deleted': true, 'departmentCode': '1-', 'description': '123', 'heartApi': '123', 'id': '10024', 'name': '123', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-04-19 15:01:55', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 23}, {'api': 'tesat', 'deleted': false, 'departmentCode': '1-', 'description': 'tesat', 'heartApi': 'teaet', 'id': '10023', 'name': 'tesat', 'scope': '0', 'serviceStatus': '1', 'updateTime': '2023-04-12 16:12:06', 'updateUserName': '超级管理员', 'scope_detail': '不公开', 'serviceStatus_detail': '正常', 'index': 24}, {'api': '321', 'deleted': true, 'departmentCode': '1-', 'description': '312', 'heartApi': '312', 'id': '10017', 'name': '123', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-04-19 15:01:18', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 25}, {'api': '123', 'deleted': true, 'departmentCode': '1-', 'description': '123', 'id': '10016', 'name': '123', 'scope': '0', 'serviceStatus': '1', 'updateTime': '2023-04-12 16:12:04', 'updateUserName': '超级管理员', 'scope_detail': '不公开', 'serviceStatus_detail': '正常', 'index': 26}, {'api': 'aaa', 'deleted': false, 'departmentCode': '1-', 'description': 'aaa', 'id': '10015', 'name': 'aaa', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-04-06 17:32:51', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 27}, {'api': 'sss', 'deleted': false, 'departmentCode': '1-', 'description': 'sss', 'id': '10014', 'name': 'sss', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-03-13 15:47:45', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 28}, {'api': 'qqq', 'deleted': true, 'departmentCode': '1-', 'description': 'qqq', 'id': '10013', 'name': 'qqq', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-04-12 09:44:58', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 29}, {'api': '321', 'deleted': true, 'departmentCode': '1-', 'description': '321', 'id': '10012', 'name': '321', 'scope': '0', 'serviceStatus': '1', 'updateTime': '2023-03-13 15:34:00', 'updateUserName': '超级管理员', 'scope_detail': '不公开', 'serviceStatus_detail': '正常', 'index': 30}, {'api': '123', 'deleted': true, 'departmentCode': '1-', 'description': '123', 'id': '10011', 'name': '123', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-03-13 15:32:01', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 31}, {'api': '321', 'deleted': true, 'departmentCode': '1-', 'description': '321', 'id': '10010', 'name': '321', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-03-13 15:31:46', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 32}, {'api': '123', 'deleted': true, 'departmentCode': '1-', 'description': '123', 'id': '10009', 'name': '123', 'scope': '0', 'serviceStatus': '1', 'updateTime': '2023-03-13 15:31:45', 'updateUserName': '超级管理员', 'scope_detail': '不公开', 'serviceStatus_detail': '正常', 'index': 33}, {'api': 'www1', 'deleted': true, 'departmentCode': '1-', 'description': 'www1', 'id': '10008', 'name': 'www1', 'scope': '0', 'serviceStatus': '1', 'updateTime': '2023-03-13 15:31:44', 'updateUserName': '超级管理员', 'scope_detail': '不公开', 'serviceStatus_detail': '正常', 'index': 34}, {'api': 'www.baidu.com', 'deleted': false, 'departmentCode': '1-', 'description': '百度四下 你就知道', 'id': '10004', 'name': '百度', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-03-13 15:31:43', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 35}, {'api': 'www.baidu.com', 'deleted': false, 'departmentCode': '1-', 'description': '百度三下 你就知道', 'id': '10003', 'name': '百度', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-03-13 15:24:42', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 36}, {'api': 'www.baidu.com', 'deleted': true, 'departmentCode': '1-', 'description': '百度二下 你就知道', 'id': '10002', 'name': '百度', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-03-13 15:25:12', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 37}]
const tableData2 = [{'api': 'www.baidu.com', 'deleted': false, 'departmentCode': '1-', 'description': '测试', 'heartApi': 'www.baidu.com', 'id': '10026', 'name': '测试服务', 'scope': '0', 'serviceStatus': '1', 'updateTime': '2023-04-13 16:22:50', 'updateUserName': '超级管理员', 'scope_detail': '不公开', 'serviceStatus_detail': '正常', 'index': 21}, {'api': '123', 'deleted': false, 'departmentCode': '1-', 'description': '123', 'heartApi': '123', 'id': '10025', 'name': '立码报打卡', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-04-13 11:37:56', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 22}, {'api': 'www.baidu.com', 'deleted': false, 'departmentCode': '1-', 'description': '测试', 'heartApi': 'www.baidu.com', 'id': '10026', 'name': '测试服务', 'scope': '0', 'serviceStatus': '1', 'updateTime': '2023-04-13 16:22:50', 'updateUserName': '超级管理员', 'scope_detail': '不公开', 'serviceStatus_detail': '正常', 'index': 21}, {'api': '123', 'deleted': false, 'departmentCode': '1-', 'description': '123', 'heartApi': '123', 'id': '10025', 'name': '立码报打卡', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-04-13 11:37:56', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 22}, {'api': 'www.baidu.com', 'deleted': false, 'departmentCode': '1-', 'description': '测试', 'heartApi': 'www.baidu.com', 'id': '10026', 'name': '测试服务', 'scope': '0', 'serviceStatus': '1', 'updateTime': '2023-04-13 16:22:50', 'updateUserName': '超级管理员', 'scope_detail': '不公开', 'serviceStatus_detail': '正常', 'index': 21}, {'api': '123', 'deleted': false, 'departmentCode': '1-', 'description': '123', 'heartApi': '123', 'id': '10025', 'name': '立码报打卡', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-04-13 11:37:56', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 22}, {'api': 'www.baidu.com', 'deleted': false, 'departmentCode': '1-', 'description': '测试', 'heartApi': 'www.baidu.com', 'id': '10026', 'name': '测试服务', 'scope': '0', 'serviceStatus': '1', 'updateTime': '2023-04-13 16:22:50', 'updateUserName': '超级管理员', 'scope_detail': '不公开', 'serviceStatus_detail': '正常', 'index': 21}, {'api': '123', 'deleted': false, 'departmentCode': '1-', 'description': '123', 'heartApi': '123', 'id': '10025', 'name': '立码报打卡', 'scope': '1', 'serviceStatus': '1', 'updateTime': '2023-04-13 11:37:56', 'updateUserName': '超级管理员', 'scope_detail': '公开', 'serviceStatus_detail': '正常', 'index': 22}]
import {TablePageMixins} from '@dinert/element-ui'
export default {
    name: 'CustomTable',
    mixins: [TablePageMixins],
    created() {
        console.log(this.table, 'this.tableeee')
    },
    mounted() {
        this.$notify.success({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: `<h3>功能说明：</h3>
                      <h4>1. 根据element-ui的table二次封装table-page</h4>
                      <h4>2. 自适应的表格缩放，支持配置性的复杂表头、支持拖拽改变位置</h4>
                      <h4>3. 基本的element-ui的表格配置和方法都可以使用</h4>
                    `,

        })
    },
    data() {
        return {
            tableData1,
            table: {

                data: [...tableData1],
                rowIndex: {

                },
                rowSelection: {

                },
                tableColumns: [
                    {
                        prop: 'id',
                        label: 'Id',
                        align: 'center'
                    },
                    {
                        prop: 'name',
                        label: '服务名称',
                        children: [
                            {
                                prop: 'name1',
                                label: '服务名称1',
                                width: 300,
                                formatter: () => {
                                    return `<div>111</div>`
                                }
                            },
                            {
                                prop: 'name2',
                                label: '服务名称2',
                            }
                        ]
                    },
                    {
                        prop: 'api',
                        label: '服务接口',
                        minWidth: 120
                    },
                    {
                        prop: 'heartApi',
                        label: '服务心跳接口',
                        minWidth: 120,
                        formatter: scope => {
                            // return `<div>321321</div>`
                        },
                        // formatter: scope => {
                        //     return this.dataTransformRod(scope.row.heartApi)
                        // }
                    },
                    {
                        prop: 'description',
                        label: '服务说明',
                        // formatter: scope => {
                        //     return this.dataTransformRod(scope.row.description)
                        // }
                    },
                    {
                        prop: 'scope_detail',
                        label: '发布范围',
                    },
                    {
                        prop: 'deleted',
                        label: '使用状态',
                    },
                    {
                        prop: 'serviceStatus_detail',
                        label: '服务状态',
                    },
                    {
                        prop: 'updateUserName',
                        label: '更新人',
                        minWidth: 100

                    },
                    {
                        prop: 'updateTime',
                        label: '更新时间',
                    },
                    {
                        prop: 'operations',
                        label: '操作',
                        align: 'center',
                        fixed: 'right',
                        operations: {
                            add: {
                                message: '编辑',
                                click: scope => {
                                    console.log(scope)
                                }
                            },
                            delete: {
                                message: '删除',
                                second: 'messageBox',
                                click: scope => {
                                    console.log(scope)
                                }
                            },
                            view: {
                                message: '查看',
                                second: true,
                                click: scope => {
                                    console.log(scope)
                                }
                            },
                            export: {
                                message: '导出',
                                click: scope => {
                                    console.log(scope)
                                }
                            }
                        },
                        width: 230
                    }

                ]
            },
            form: {
                model: {},
                formItem: {
                    name: {
                        type: 'input',
                        label: '姓名',
                        options: {
                            on: {
                                clear() {
                                    console.log('clear')
                                },
                                input(val) {
                                    console.log('input')
                                    return val
                                }
                            }
                        }
                    },
                    age: {
                        type: 'input-number',
                        label: '年龄',
                        options: {}
                    },
                    status: {
                        type: 'select',
                        label: '状态',
                        options: {
                            options: [
                                {
                                    label: '正常我是一个很长的一段文字',
                                    value: 1
                                },
                                {
                                    label: '禁用',
                                    value: 2
                                }
                            ]
                        }
                    },
                }
            }
        }
    },
    computed: {

    },
    methods: {
        changeTable() {
            console.log(this.table.data.length, 'this.table.data.lengththis.table.data.length')
            if (this.table.data.length !== 17) {
                this.table.data = tableData1
            } else {
                this.table.data = tableData2
            }
            this.$message.success('请缩放浏览器查看效果')
        }
    },

}
</script>

<style lang="scss" scoped>
.customTable {
    display: flex;
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;

    &-table {
        height: 0;
        flex: 1;
    }
}
</style>
