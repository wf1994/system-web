<template>
  <div>
    <!-- 菜单栏 -->
    <a-row :gutter="[16, 24]">
      <a-col :span="4">
        <a-input
          placeholder="请输入数据源名称查询"
          v-model="searchDataSourceName"
          allow-clear
          @change="clearSearchDataSourceName"
        ></a-input>
      </a-col>
      <a-col :span="4">
        <a-button type="primary" @click="getListByDataSourceName">查询</a-button>
      </a-col>
      <a-col :span="4" :offset="12" :style="{ textAlign: 'right' }">
        <a-button type="primary" @click="showModal" :style="{ marginRight: '15px' }">新增</a-button>
        <a-button type="info" @click="showModalDelete()">删除</a-button>
      </a-col>
    </a-row>
    <!-- 数据源列表显示 -->
    <a-row>
      <a-col :span="24">
        <a-table
          :rowKey="record => record.id"
          :columns="DataSourceColumns"
          :data-source="computeDataSourceList"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows,
            onChange: onChange
          }"
          :scroll="{ y: 600 }"
        >
          <span slot="operation" slot-scope="row">
            <a-dropdown :trigger="['click']">
              <a-menu slot="overlay">
                <a-menu-item @click="handleEdit(row)">修改</a-menu-item>
                <a-menu-item @click="RowDelete(row.id)">删除</a-menu-item>
                <a-menu-item @click="setDatasourceDefault(row)">设为默认数据源</a-menu-item>
              </a-menu>
              <a @click="e => e.preventDefault()">
                <a-icon type="dash"></a-icon>
              </a>
            </a-dropdown>
          </span>
        </a-table>
      </a-col>
    </a-row>
    <!-- 新增数据源Modal -->
    <a-modal
      title="新增数据源"
      :visible="addDataSourceVisible"
      :confirm-loading="addDataSourceLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="确定"
      cancelText="取消"
    >
      <a-radio-group v-model="dataSourceTypeValue" @change="onDataSourceTypeChange">
        <a-radio :style="radioStyle" :value="1">sql</a-radio>
        <a-radio :style="radioStyle" :value="2">excel</a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      DataSourceList: [], // 数据源列表
      searchDataSourceName: '', //查询数据源名称输入框的内容
      DataSourceColumns: [
        { title: '数据源名称', dataIndex: 'databasename', key: 'databasename' },
        { title: '数据源类型', dataIndex: 'databasetype', key: 'databasetype' },
        { title: '备注', dataIndex: 'note', key: 'note' },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
        // { title: 'id', dataIndex: 'id', key: 'id' },
        {
          title: '操作',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      // 数据源列
      addDataSourceVisible: false, // 添加数据源Modal显示
      addDataSourceLoading: false, // 添加数据源确定按钮loading
      selectedRowKeys: [], // 选中的行的id数组
      selectedRows: [], // 选中行的数据

      // 数据源类型
      dataSourceTypeValue: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    }
  },

  beforeCreate() {
    this.editDataSourceForm = this.$form.createForm(this, {
      name: 'editDataSourceForm'
    })
  },

  created() {
    this.getDataSourceList()
  },

  methods: {
    // 设为默认数据源
    async setDatasourceDefault(row) {
      const { data: res } = await this.$http.request({
        url: '/setDatasourceDefault',
        methods: 'get',
        params: {
          id: row.id
        }
      })
      if (res.status == '200') {
        this.$message.success('设置默认数据源成功')
      } else {
        this.$message.error('设置默认数据源失败！')
      }
    },

    // 新增数据源modal显示
    showModal() {
      this.addDataSourceVisible = true
    },

    // 数据源类型单选框处理
    onDataSourceTypeChange(e) {
      this.dataSourceTypeValue = e.target.value
    },

    // 新增数据源Modal提交
    handleOk() {
      this.$router.push({
        path: '/dataSourceSet',
        query: {
          dataSourceTypeValue: this.dataSourceTypeValue,
          operation: 'addDataSource'
        }
      })
    },

    // 新增数据源Modal取消
    handleCancel() {
      this.addDataSourceVisible = false
      // this.addDataSourceLoading = false
    },

    // 删除数据源modal显示
    showModalDelete() {
      // 接收this对象，因为在$confirm()中无法取到this
      const _this = this
      // 函数参数对象
      const args = arguments
      // 待拼装参数
      let params = []
      // 该函数未传入参数，说明是点击的多选删除，将已选则行的数据直接赋值给params
      if (args.length === 0) {
        params = this.selectedRowKeys
        // console.log(params)
      } else {
        params = [args[0]]
        this.selectedRows = [args[0]]
      }
      // 删除提示中，具体的维度名称
      const removeText = this.selectedRows
        .map(item => item.databasename)
        .join('、')
      if (params.length !== 0) {
        this.$confirm({
          title: '删除数据源',
          content: (
            <div>
              <p>
                确定删除：<a>{removeText}</a>
                &nbsp;吗？
              </p>
              <p>
                <em>删除后无法恢复，请谨慎操作！</em>
              </p>
            </div>
          ),
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.removeDataSourceByIds(params)
          },
          onCancel() {
            _this.$message.info('已取消删除操作！')
          }
        })
      } else {
        _this.$message.info('请选择数据源进行删除！')
      }
    },

    // 通过ids删除数据源提交
    async removeDataSourceByIds(ids) {
      // console.log('params', ids)
      const { data: res } = await this.$http
        .request({
          url: '/removeDataSource',
          methods: 'post',
          params: {
            ids
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, { indices: false })
          }
        })
        // 返回的错误信息用catch接
        .catch(error => {
          this.$message.error('删除数据源失败！' + error)
          this.selectedRowKeys = []
        })
      if (res.meta.status === 200) {
        this.$message.success('删除数据源成功！')
      } else {
        this.$message.error('删除数据源失败！')
      }
      this.selectedRowKeys = []
      this.getDataSourceList()
    },

    // 获取数据源列表数据
    async getDataSourceList() {
      const { data: res } = await this.$http.request({
        url: '/getDataList',
        methods: 'get'
      })
      if (res.meta.status === 200) {
        this.DataSourceList = res.data
        //console.log('this.DataSourceList', this.DataSourceList)
        //console.log('数据源列表获取成功')
      } else {
        this.$message.error('数据源列表获取失败！')
      }
    },

    //  通过数据源名称查询列表
    async getListByDataSourceName() {
      const { data: res } = await this.$http.request({
        url: '/getDataByDataSourceName',
        methods: 'get',
        params: {
          dataSourceName: this.searchDataSourceName
        }
      })
      if (res.msg.status === 200) {
        //console.log('查询数据', res.data)
        this.DataSourceList = res.data
        //console.log('this.DataSourceList', this.DataSourceList)
        this.$message.success('查询成功！')
      } else {
        this.$message.error('查询失败！')
      }
    },

    // 清除查询数据源名称
    clearSearchDataSourceName(e) {
      if (e.type === 'click') {
        this.searchDataSourceName = ''
        this.getDataSourceList()
      }
    },

    // 数据源修改处理
    handleEdit(row) {
      if (row.databasetype === 'kingbase') {
        this.dataSourceTypeValue = 1
      } else {
        this.dataSourceTypeValue = 2
      }
      this.$router.push({
        path: '/dataSourceSet',
        query: {
          id: row.id,
          dataSourceTypeValue: this.dataSourceTypeValue,
          operation: 'editDataSource'
        }
      })
    },

    // 单条数据源的删除
    RowDelete() {
      const _this = this
      const args = arguments
      let params = []
      if (args.length === 0) {
        params = this.selectedRowKeys
      } else {
        params = [args[0]]
      }
      if (params.length !== 0) {
        this.$confirm({
          title: '删除数据源',
          content: '确定删除该数据源吗？删除后将不可恢复，请谨慎操作！',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.removeDataSourceByIds(params)
          },
          onCancel() {
            _this.$message.info('已取消删除操作！')
          }
        })
      } else {
        _this.$message.info('请选择数据源进行删除！')
      }
    },

    // 选择项改变处理函数
    onChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },

  computed: {
    computeDataSourceList() {
      let tempList = []
      if (this.DataSourceList !== null) {
          tempList = this.DataSourceList.map(item => {
          return {
            ...item,
            key: item.id
          }
        })
      }
      return tempList
    }
  }
}
</script>
<style lang="less" scoped></style>
