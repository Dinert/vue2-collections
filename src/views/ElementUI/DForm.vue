<template>
    <div class="DForm">
        <dinert-form ref="dinertFormRef" :form="form"
            class="near"
        >
            <!-- <template #form_search>
                11
            </template> -->
        </dinert-form>

    </div>
</template>

<script>
// import {DinertForm} from '@dinert/element-ui'
export default {
    name: 'DForm',
    mixins: [],
    components: {
        // DinertForm
    },
    created() {

    },
    mounted() {
        this.dinertFormRef = this.$refs.dinertFormRef
        console.log(this.dinertFormRef, 'this.dinertFormRefff')
        // this.dinertFormRef.$refs
    },
    data() {
        return {
            dinertFormRef: null,
            checkboxGroup1: '',
            form: {
                model: {
                    age: 0,
                },
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
                    enabled: {
                        type: 'switch',
                        label: '开关',

                    },
                    datetime: {
                        type: 'datetime',
                        label: '小时时间',
                        options: {}
                    },
                    datetimerange: {
                        type: 'datetimerange',
                        label: '小时时间范围',
                        options: {}
                    },
                    date: {
                        type: 'date',
                        label: '日期',
                        options: {}
                    },
                    dates: {
                        type: 'dates',
                        label: '多个日期',
                    },
                    daterange: {
                        type: 'daterange',
                        label: '日期范围',
                        options: {}
                    },
                    week: {
                        type: 'week',
                        label: '周',
                    },
                    month: {
                        type: 'month',
                        label: '月',
                    },
                    months: {
                        type: 'months',
                        label: '多个月',
                    },
                    momthrange: {
                        type: 'monthrange',
                        label: '月范围',
                    },
                    year: {
                        type: 'year',
                        label: '年',
                    },
                    years: {
                        type: 'years',
                        label: '多个年',
                    },
                    radio: {
                        type: 'radio',
                        label: '单选',
                        options: {
                            options: [
                                {
                                    label: '男',
                                    value: 1
                                },
                                {
                                    label: '女',
                                    value: 2
                                }
                            ]
                        }
                    },
                    radioborder: {
                        type: 'radio',
                        label: '单选边框',
                        options: {
                            options: [
                                {
                                    label: '男',
                                    value: 1,
                                    border: true
                                },
                                {
                                    label: '女',
                                    value: 2,
                                    border: true
                                }
                            ]
                        }
                    },
                    'radio-button': {
                        type: 'radio-button',
                        label: '单选按钮',
                        options: {
                            options: [
                                {
                                    label: '广州',
                                    value: 1
                                },
                                {
                                    label: '深圳',
                                    value: 2
                                },
                                {
                                    label: '北京',
                                    value: 3
                                },
                                {
                                    label: '上海',
                                    value: 4
                                }
                            ]
                        }
                    },
                    rate: {
                        type: 'rate',
                        label: '评分',
                        options: {
                            allowHalf: true
                        }
                    },
                    checkbox: {
                        type: 'checkbox',
                        label: '多选',
                        options: {
                            options: [
                                {
                                    label: '男',
                                    value: '1'
                                },
                                {
                                    label: '女',
                                    value: '2'
                                }
                            ]
                        }
                    },
                    checkboxborder: {
                        type: 'checkbox',
                        label: '多选边框',
                        options: {
                            options: [
                                {
                                    label: '男',
                                    value: '1',
                                    border: true
                                },
                                {
                                    label: '女',
                                    value: '2',
                                    border: true
                                }
                            ]
                        }
                    },
                    checkboxButton: {
                        type: 'checkbox-button',
                        label: '多选按钮',
                        options: {
                            options: [
                                {
                                    label: '广州',
                                    value: '1'
                                },
                                {
                                    label: '深圳',
                                    value: '2'
                                },
                                {
                                    label: '北京',
                                    value: '3'
                                },
                                {
                                    label: '上海',
                                    value: '4'
                                }
                            ]
                        }
                    },
                    cascader: {
                        type: 'cascader',
                        label: '级联选择',
                        options: {
                            options: [
                                {
                                    value: 'zhejiang',
                                    label: '浙江',
                                    children: [
                                        {
                                            value: 'hangzhou',
                                            label: '杭州',
                                            children: [
                                                {
                                                    value: 'xihu',
                                                    label: '西湖'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    value: 'jiangsu',
                                    label: '江苏',
                                    children: [
                                        {
                                            value: 'nanjing',
                                            label: '南京',
                                            children: [
                                                {
                                                    value: 'zhonghuamen',
                                                    label: '中华门'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    slider: {
                        type: 'slider',
                        label: '滑块',
                        options: {
                        }
                    },
                    timepick: {
                        type: 'time-picker',
                        label: '时间选择器',
                    }
                }
            }
        }
    },
    computed: {

    },
    methods: {
        focusInput() {
            // this.dinertFormRef.nameInput
            console.log(this.dinertFormRef, 'this.dinertFormRef.nameInput.$refs')

        }
    },

}
</script>

<style lang="scss" scoped>

</style>
