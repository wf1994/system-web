<template>
  <div>
    <!-- 查询 新增 删除 -->
    <a-row>
      <a-col :span="4">
        <a-input
          class="search"
          placeholder="请输入组件名称查询"
          v-model="searchComponentName"
          allow-clear
          @change="clearSearchComponentName"
        ></a-input>
      </a-col>
      <a-col :span="4">
        <a-button @click="searchByComponentName" type="primary">查询</a-button>
      </a-col>
      <a-col :span="4" :offset="12" :style="{ textAlign: 'right' }">
        <a-button type="primary" @click="goTo()" :style="{ marginRight: '5%' }"
          >新增</a-button
        >
        <a-button type="info" @click="delComponent()">删除</a-button>
      </a-col>
    </a-row>
    <div class="back-space-30"></div>
    <!-- table -->
    <a-row>
      <a-col :span="24">
        <a-table
          class="table"
          :rowKey="record => record.id"
          :columns="componentColumns"
          :data-source="computeComponentListData"
          :row-selection="rowSelection"
          :pagination="true"
          :loading="componentListLoading"
        >
          <span
            slot="componentName"
            slot-scope="text, row"
            :style="{ color: '#128075', cursor: 'pointer' }"
            @click="editComponent(row.id)"
          >
            {{ row.componentName }}
          </span>
          <span slot="dimensions" slot-scope="text, row">
            {{ row.dimensions.join('、') }}
          </span>
          <span slot="text" slot-scope="text, row">{{ row }}</span>
          <span slot="operation" slot-scope="row">
            <a-dropdown :trigger="['click']">
              <a-menu slot="overlay">
                <a-menu-item @click="editComponent(row.id)">修改</a-menu-item>
                <a-menu-item @click="delComponent(row.id)">删除</a-menu-item>
              </a-menu>
              <a @click="e => e.preventDefault()">
                <a-icon type="dash"></a-icon>
              </a>
            </a-dropdown>
          </span>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>
<script>
const componentColumns = [
  {
    title: '组件名称',
    dataIndex: 'componentName',
    key: 'componentName',
    scopedSlots: { customRender: 'componentName' }
    // color: '#128075'
  },
  {
    title: '维度',
    dataIndex: 'dimensions',
    key: 'dimensions',
    scopedSlots: { customRender: 'dimensions' }
  },
  { title: '统计项', dataIndex: 'statisItem', key: 'statisItem' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  data() {
    return {
      computeComponentListData2: [
        {
          id: 1,
          componentName: '组件1',
          dimensions: ['维度1', '维度2'],
          statisItem: '现有数量',
          createTime: '2020-06-06 12:12:12'
        },
        {
          id: 2,
          componentName: '组件12',
          dimensions: ['维度3'],
          statisItem: '现有数量',
          createTime: '2020-06-06 12:12:12'
        },
        {
          id: 3,
          componentName: '组件3',
          dimensions: ['维度1'],
          statisItem: '现有数量',
          createTime: '2020-06-06 12:12:12'
        }
      ],
      pageSize: 20,
      current: 4,
      searchComponentName: '', // 查询组件名称
      componentListData: [], // 组件列表数据
      componentColumns, // 组件列
      selectedRowKeys: [], // 选中的行的id数组
      dimenionsList: '',
      componentListLoading: true
    }
  },
  beforeCreate() {},
  created() {
    this.getComponentList()
  },
  methods: {
    //新增跳转页面
    goTo() {
      const add = 'add'
      this.$router.push(`componentAdd/${add}`)
    },
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize)
    },
    // 获取组件列表
    async getComponentList() {
      const { data: res } = await this.$http.request({
        url: '/getComponentList',
        methods: 'get'
      })
      if (res.meta.status === 200) {
        this.componentListLoading = false
        this.componentListData = res.data
        console.log('组件列表获取成功')
      } else {
        this.$message.error('组件列表获取失败！')
      }
    },
    // 通过组件名称查询列表
    async searchByComponentName() {
      const { data: res } = await this.$http.request({
        url: '/filterComponentList',
        methods: 'get',
        params: { component_name: this.searchComponentName }
      })
      if (res.meta.status === 200) {
        this.componentListData = res.data
        this.$message.success('查询成功！')
      } else {
        this.$message.error('查询失败！')
      }
    },
    // 清除查询组件名称
    clearSearchComponentName(e) {
      if (e.type === 'click') {
        this.searchComponentName = ''
        this.getComponentList()
      }
    },
    //修改
    editComponent(id) {
      this.$router.push(`/componentAdd/${id}`)
    },
    // 删除维度确认框显示
    delComponent() {
      const _this = this
      const args = arguments
      let params = []
      if (args.length === 0) {
        params = this.selectedRowKeys
      } else {
        params = [args[0]]
        console.log(`单选的params是${params}`)
      }
      console.log('parmes=======' + params)
      if (params.length !== 0) {
        this.$confirm({
          title: '删除组件',
          content: '确定删除该组件吗？删除后将不可恢复，请谨慎操作！',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.removeComponentByIds(params)
          },
          onCancel() {
            _this.$message.info('已取消删除操作！')
          }
        })
      } else {
        _this.$message.info('请选择组件进行删除！')
      }
    },
    // 通过ids删除组件提交
    async removeComponentByIds(ids) {
      console.log('params', ids)
      const { data: res } = await this.$http.request({
        url: '/removeComponent',
        methods: 'post',
        params: {
          ids
        },
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false })
        }
      })
      if (res.meta.status === 200) {
        this.$message.success('删除组件成功！')
      } else {
        this.$message.error('删除组件失败！')
      }
      this.getComponentList()
    }
  },
  computed: {
    computeComponentListData() {
      const tempList = this.componentListData.map(item => {
        return {
          ...item,
          key: item.id
        }
      })
      return tempList
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows
          )
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.pull-right {
  float: right;
}
.back-space-30 {
  height: 30px;
}
.search {
  width: 240px;
  height: 32px;
}
.searchWord {
  width: 85px;
  height: 32px;
  background: #1c857a;
  border-radius: 2px;
  color: white;
  font-size: 12px;
}
.addButton {
  margin-right: 12px;
  width: 80px;
  height: 32px;
  background: #128075;
  color: white;
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  text-align: center;
  line-height: 14px;
}
.delButton {
  width: 80px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #e2e3e6;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  text-align: center;
  line-height: 14px;
}
.table {
  // width: 1572px;
  // height: 760px;
  background: #ffffff;
  border: 1px solid #e2e3e6;
  font-size: 14px;
}
</style>
