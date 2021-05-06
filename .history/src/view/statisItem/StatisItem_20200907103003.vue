<template>
  <div style="padding: 15px 40px">
    <a-row type="flex" justify="start" align="middle">
      <a-col :span="4">
        <i class="title-icon"></i>
        <span class="title-text">统计项</span>
      </a-col>
    </a-row>
    <a-row class="form-row">
      <a-col :span="15">
        <a-form
          :form="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 10 }"
          labelAlign="left"
        >
          <!-- <h3 class="subTittle">编制数量</h3> -->
          <a-form-item :labelCol="{ span: 8 }" label="统计项名称">
            <a-input
              v-decorator="[
                'standardNum',
                {
                  rules: [
                    {
                      required: true,
                      message: '名称不能为空！'
                    }
                  ],
                  initialValue: ediFormData.standardNum
                }
              ]"
              placeholder="请输入统计项名称..."
            />
          </a-form-item>
          <p class="tips"></p>
          <!-- <h3 class="subTittle">现有数量</h3> -->
          <a-form-item :labelCol="{ span: 8 }" label="统计项">
            <a-input
              v-decorator="[
                'exisitNum',
                {
                  rules: [
                    {
                      required: true,
                      message: '名称不能为空！'
                    }
                  ],
                  initialValue: ediFormData.exisitNum
                }
              ]"
              placeholder="统计项..."
            />
          </a-form-item>
          <p class="tips"></p>
          <h3 class="subTittle">统计规则</h3>
          <a-form-item :labelCol="{ span: 8 }" label="统计规则名称">
            <a-select
              v-decorator="[
                'staticRule',
                {
                  rules: [
                    {
                      required: true,
                      message: '统计规则不能为空！'
                    }
                  ],
                  initialValue: ediFormData.staticRule
                }
              ]"
              placeholder="请选择统计规则..."
            >
              <a-select-option value="count">
                count
              </a-select-option>
              <a-select-option value="sum">
                sum
              </a-select-option>
            </a-select>
          </a-form-item>
          <p class="tips">统计规则为数据库采用的统计方式</p>
        </a-form>
        <a-button v-if="show" class="saveButton" type="primary" @click="showConfirm"
          >保存</a-button
        >
        <a-button v-if="!show" class="saveButton" type="primary" @click="editSave"
          >保存</a-button
        >
      </a-col>
    </a-row>
  </div>
</template>
<script type="text/jsx">
export default {
  data() {
    return {
      show: true,
      dataSourceId: 0,
      ediFormData: {
        standardNum: '',
        exisitNum: '',
        staticRule: '',
      }, //编辑表单
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'StatisItemForm' })
  },
  created() {
    this.getDataSourceId()
  },
  mounted() {
    this.show = true
    if (this.$route.params.id !== 'add') {
      this.show = false
      setTimeout(() => {
        this.getStatisData(this.$route.params.id)
      }, 100)
    }
  },
  methods: {
    //获取数据源ID（二期新增）
    async getDataSourceId() {
      const { data: res } = await this.$http.request({
        url: '/getCurrentDataSourceId',
        methods: 'get'
      })
      if (res.meta.status === 200) {
        this.dataSourceId = res.data.currentDataSourceId
      } else {
        this.$message.error('数据集列表获取失败！')
      }
    },
    async getStatisData(id) {
      const { data: res } = await this.$http.request({
        methods: 'get',
        url: 'selectStatisById',
        params: { id }
      })
      if (res.status === 200) {
        this.ediFormData.standardNum = res.data.item_name
        this.ediFormData.exisitNum = res.data.field
        this.ediFormData.staticRule = res.data.staticRule
        // console.log('回显数据:', this.ediFormData)
      }
    },
    //新增保存
    showConfirm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(this);
          const _this = this
          console.log('Received values of form: ', values);
          this.$confirm({
            title: '保存统计项',
            content: <div style="color:green;">确定保存该统计项设置吗？</div>,
            okText: '确定',
            cancelText: '取消',
            onOk () {
            _this.saveStatisItem(values)
            },
            onCancel() {
            console.log('Cancel')
            }
          })
        }
      });
    },
    //修改保存
    editSave() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(this);
          const _this = this
          console.log('Received values of form: ', values);
          this.$confirm({
            title: '保存统计项',
            content: <div style="color:green;">确定保存该统计项设置吗？</div>,
            okText: '确定',
            cancelText: '取消',
            onOk () {
            _this.saveStatisItem2(values)
            },
            onCancel() {
            console.log('Cancel')
            }
          })
        }
      });
    },
    async saveStatisItem(values){
      console.log('+++++++++++++++++')
      let saveData = {
        item_name: values.standardNum,
        field: values.exisitNum,
        staticRule: values.staticRule,
        datasourceid: parseInt(this.dataSourceId)
      }
      const { data: res } = await this.$http.request({
        url:'/saveStatisSet',
        method:'post',
        params:saveData
      })
      if(res.meta.status === 200){
        this.$message.success('保存统计项成功')
      }
      else {
        this.$message.error('保存统计项失败')
      }
    },
    async saveStatisItem2(values){
      console.log('+++++++++++++++++')
      let saveData = {
        item_name: values.standardNum,
        field: values.exisitNum,
        staticRule: values.staticRule,
        id: this.$route.params.id
      }
      const { data: res } = await this.$http.request({
        url:'/updateStatis',
        method:'post',
        params:saveData
      })
      if(res.meta.status === 200){
        this.$message.success('保存统计项成功')
      }
      else {
        this.$message.error('保存统计项失败')
      }
    },
  }
}
</script>
<style lang="less" scoped>
.title-icon {
  display: inline-block;
  width: 4px;
  height: 1rem;
  background-color: #128075;
  vertical-align: middle;
}
.title-text {
  font-size: 1rem;
  vertical-align: middle;
  margin-left: 5px;
}
.form-row {
  margin-top: 15px;
}
.saveButton {
  display: block;
  margin: 0 auto;
}
.tips {
  color: #7c8191;
  background-color: #f6f7f9;
  padding: 5px 15px;
  margin-bottom: 60px;
}
.subTittle {
  color: #606a95;
  margin: 20px 0px;
  font-weight: bolder;
}
</style>
