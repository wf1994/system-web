<template>
  <div>
    <a-row :gutter="[16, 24]">
      <a-col :span="4"> </a-col>
      <a-col :span="4"> </a-col>
      <a-col :span="4" :offset="12" :style="{ textAlign: 'right' }">
        <a-button
          type="primary"
          @click="goToStatisItem"
          :style="{ marginRight: '15px' }"
          >新增</a-button
        >
        <!-- <a-button type="info" @click="showModalDelete()">删除</a-button> -->
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-table
          :rowKey="record => record.id"
          :columns="DataSetColumns"
          :data-source="computeDataSetData"
        
          :scroll="{ y: 600 }"
        >
          <span slot="operation" slot-scope="row">
            <a-dropdown :trigger="['click']">
              <a-menu slot="overlay">
                <a-menu-item @click="editComponent(row.id)">
                  修改
                </a-menu-item>
                <a-menu-item @click="RowDelete(row.id)">
                  删除
                </a-menu-item>
              </a-menu>
              <a @click="e => e.preventDefault()"
                ><a-icon type="dash"></a-icon
              ></a>
            </a-dropdown>
          </span>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import Bus from '../../utils/bus.js'
export default {
  data() {
    return {
      dataSourceId: 0,
      DataSetData: [], // 列表数据
      searchDataSetName: '', //查询数据集名称输入框的内容
      DataSetColumns: [
        { title: '统计项名称', dataIndex: 'item_name', key: 'item_name' },
        { title: '统计项', dataIndex: 'field', key: 'field' },
        { title: '统计规则', dataIndex: 'staticRule', key: 'staticRule' },
        // { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
        {
          title: '操作',
          key: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      // 数据集列
      editDataSetFormData: {}, // 修改数据集回显数据
      selectedRowKeys: [], // 选中的行的id数组
      selectedRows: [] // 选中行的数据
    }
  },
  beforeCreate() {},
  created() {
    //先获取数据源ID，再获取数据列表
    this.getDataSourceId()
    // setTimeout(() => {
    //   this.getDataSetList()
    // }, 0)
    Bus.$on('getChartIdBus', name => {
      console.log('数据源ID：', name)
      // this.dataSourceId = name
    })
  },
  methods: {
    // 新增统计项
    goToStatisItem() {
      //跳转设置页面
      const add = 'add'
      this.$router.push(`/statisItem/${add}`)
    //   this.$router.push(`/statisItem`)
    },
    //修改
    editComponent(id) {
      this.$router.push(`/statisItem/${id}`)
    },
    // 通过id删除数据集提交
    async removeDataSetByIds(id) {
        const { data: res } = await this.$http.request({
        url: '/deleteStatis',
        methods: 'post',
        params: {
          id
        },
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false })
        }
      })
      if (res.status === 200) {
        this.$message.success('删除组件成功！')
      } else {
        this.$message.error('删除组件失败！')
      }
      // this.getDataSetList()
      this.getDataSourceId()
    },
    // 获取列表数据(二期修改多传了数据源ID)
    async getDataSetList(id) {
      const { data: res } = await this.$http.request({
        url: '/getStatisSet',
        methods: 'get',
        params: {
          datasourceid: id
        }
      })
      if (res.status === 200) {
        this.DataSetData = res.data
        console.log('this.DataSetData', this.DataSetData)
        console.log('统计项列表获取成功')
      } else {
        this.$message.error('统计项列表获取失败！')
      }
    },
    //获取统计项列表
    async getDataSet(row) {
      console.log('row', row)
      const { data: res } = await this.$http.request({
        url: `/getDataSet/:id`,
        methods: 'get',
        params: {
          id: row.id
        }
      })
      console.log('res===', res)
      if (res.meta.status === 200) {
        this.editDataSetFormData = res.data
      } else {
        this.$message.error('获取数据集失败！')
      }
    },
    // 单条数据集的删除
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
          title: '删除数据集',
          content: '确定删除该数据集吗？删除后将不可恢复，请谨慎操作！',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.removeDataSetByIds(params)
          },
          onCancel() {
            _this.$message.info('已取消删除操作！')
          }
        })
      } else {
        _this.$message.info('请选择数据集进行删除！')
      }
    },
    onChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    //获取数据源ID（二期新增）
    async getDataSourceId() {
      const { data: res } = await this.$http.request({
        url: '/getCurrentDataSourceId',
        methods: 'get'
      })
      if (parseInt(res.status) === 200) {
        this.dataSourceId = res.datasourceid
        this.getDataSetList(this.dataSourceId)
      } else {
        this.$message.error('数据集列表获取失败！')
      }
    }
  },
  computed: {
    computeDataSetData() {
      const tempList = this.DataSetData.map(item => {
        return {
          ...item,
          key: item.id
        }
      })
      return tempList
    },
    currentDataSourceId() {
      let tempId = this.dataSourceId
      return tempId
    }
  }
}
</script>
<style lang="less" scoped></style>
