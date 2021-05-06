<template>
  <div style="padding: 0 40px">
    <a-row>
      <!-- kingBase数据源 -->
      <a-col :span="10">
        <div id="kingbase-form">
          <i class="title-icon"></i>
          <span class="title-text" @click="toggleForm">kingBase数据源设置</span>
          <div style="margin-top: 30px; position: relative;">
            <div class="shadow" id="kingbase-form-shadow"></div>
            <a-form
              :form="form"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
              labelAlign="left"
            >
              <!-- <a-form-item>
              <i class="title-icon"></i>
              <span class="title-text" @click="toggleForm">kingBase数据源设置</span>
            </a-form-item> -->

              <a-form-item label="IP">
                <a-input v-decorator="[ 'ip', { rules: [ { required: true,
                message: 'IP不能为空！' } ] } ]"
                :disabled="kingBase_DS_disabled" placeholder="请输入IP地址..."
                initialValue: DS_kingBase.ip />
              </a-form-item>
              <a-form-item label="端口号">
                <a-input
                  v-decorator="[
                    'port',
                    {
                      rules: [
                        {
                          required: true,
                          message: '端口号不能为空！'
                        }
                      ]
                    }
                  ]"
                  :disabled="kingBase_DS_disabled"
                  placeholder="请输入端口号..."
                />
              </a-form-item>
              <a-form-item label="用户名">
                <a-input
                  v-decorator="[
                    'username',
                    {
                      rules: [
                        {
                          required: true,
                          message: '用户名不能为空！'
                        }
                      ]
                    }
                  ]"
                  :disabled="kingBase_DS_disabled"
                  placeholder="请输入用户名..."
                />
              </a-form-item>
              <a-form-item label="密码">
                <a-input
                  v-decorator="[
                    'password',
                    {
                      rules: [
                        {
                          required: true,
                          message: '密码不能为空！'
                        }
                      ]
                    }
                  ]"
                  :disabled="kingBase_DS_disabled"
                  type="password"
                  placeholder="请输入密码..."
                />
              </a-form-item>
              <!-- <a-form-item label="数据库类型">
              <a-select
                v-decorator="[
                  'databasetype',
                  {
                    rules: [{ required: true, message: '数据库类型不能为空！' }]
                  }
                ]"
                :disabled="kingBase_DS_disabled"
                placeholder="请选择数据库类型..."
              >
                <a-select-option value="kingbase">金仓数据库</a-select-option>
              </a-select>
            </a-form-item> -->
              <a-form-item label="数据库名称">
                <a-input
                  v-decorator="[
                    'databasename',
                    {
                      rules: [
                        {
                          required: true,
                          message: '数据库名不能为空！'
                        }
                      ]
                    }
                  ]"
                  :disabled="kingBase_DS_disabled"
                  placeholder="请输入数据库名称..."
                />
              </a-form-item>
              <a-form-item label="数据库备注">
                <a-input
                  v-decorator="[
                    'note',
                    {
                      rules: [
                        {
                          required: false
                        }
                      ]
                    }
                  ]"
                  :disabled="kingBase_DS_disabled"
                  placeholder="请输入备注..."
                />
              </a-form-item>
            </a-form>
            <a-button
              class="saveButton"
              type="primary"
              @click="showConfirm"
              :disabled="kingBase_DS_disabled"
              >保存</a-button
            >
          </div>
        </div>
      </a-col>

      <!-- excel数据源 -->
      <a-col :span="10" :offset="2">
        <div id="excel-form">
          <i class="title-icon"></i>
          <span class="title-text" @click="toggleForm">excel数据源设置</span>
          <div style="margin-top: 30px; position: relative">
            <div class="shadow" id="excel-form-shadow"></div>
            <a-form
              :form="excelDataSourceForm"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
              labelAlign="left"
            >
              <!-- 上传文件 -->
              <a-form-item label="上传文件">
                <a-input
                  v-decorator="['filepath']"
                  :disabled="excel_DS_disabled"
                  style="display: none; z-index: -1"
                />
                <a-upload
                  :file-list="fileList"
                  :disabled="excel_DS_disabled"
                  :remove="removeFile"
                  :before-upload="beforeUpload"
                >
                  <a-button
                    :disabled="fileList.length === 1 || excel_DS_disabled"
                  >
                    <a-icon type="upload" />上传文件
                  </a-button>
                </a-upload>
              </a-form-item>

              <!-- 数据源名称 -->
              <a-form-item label="数据源名称">
                <a-input
                  v-decorator="[
                    'dataSourceName',
                    {
                      rules: [
                        {
                          required: true,
                          message: '名称不能为空！'
                        }
                      ]
                    }
                  ]"
                  :disabled="excel_DS_disabled"
                  placeholder="请输入数据源名称..."
                />
              </a-form-item>

              <!-- 备注 -->
              <a-form-item label="数据源备注">
                <a-input
                  v-decorator="[
                    'note',
                    {
                      rules: [
                        {
                          required: false
                        }
                      ]
                    }
                  ]"
                  :disabled="excel_DS_disabled"
                  placeholder="请输入相应备注..."
                />
              </a-form-item>
            </a-form>

            <!-- 提交按钮 -->
            <a-button
              class="saveButton"
              type="primary"
              :loading="loading"
              :disabled="excel_DS_disabled"
              @click="save_excel_DS_confirm"
            >
              保存
            </a-button>
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- <a-row>
      <form id="formzxy" method="POST" enctype="multipart/form-data" ref="uploadform">
      <input type="file" id="fileSelect" name="file" @change="addFile">
      </form>
    </a-row> -->
  </div>
</template>
<script type="text/jsx">
export default {
  data() {
    return {
      dataSourceTypeValue: 1,
      excel_DS_disabled: false,
      kingBase_DS_disabled: false,
      fileList: [],
      loading:false,
      uploading: false,
      fileUrl: '',
      DS_kingBase: [],
      excelDataSource: {}
    }
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'dataSourceForm' });
    // 设置excel数据源表单
    this.excelDataSourceForm = this.$form.createForm(this, {
      name: 'excelDataSourceForm'
    });
  },

  created() {
    this.getRouteParams();
  },

  mounted() {
    this.showShadow();
  },

  methods: {
    //测试上传文件
    // addFile() {
    //   let form = document.getElementById("form1")
    //   let form1 = new FormData(form)
    //   let config = { 'Content-Type': 'multipart/form-data', withCredentials: true}
    //   let params = form1
    // },
    showConfirm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(this)
          const _this = this
          if (values.note === undefined) {
            values.note = "";
          }
          console.log('Received values of form: ', values)
          this.$confirm({
            title: '保存数据源',
            content: <div style="color:green;">确定保存该数据源设置吗？</div>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
              if (_this.$route.query.operation === "editDataSource") {
                values.id = _this.$route.query.id;
                console.log(values);
                _this.editDataSource(values);
              }else {
                _this.saveDataSource(values)
              }
            },
            onCancel() {
              console.log('Cancel')
            }
          })
        }
      })
    },

    // 新增金仓数据源
    async saveDataSource(values) {
      const { data: res } = await this.$http.request({
        url: '/saveDataSource',
        method: 'post',
        params: values
      })
      if (res.meta.status === 200) {
        this.$message.success('保存数据源成功')
        this.form.resetFields();
      } else {
        this.$message.error('保存数据源失败')
      }
    },

    // 获取由路由带过来的参数：数据源类型的取值，根据取值选择要操作的数据源设置
    getRouteParams() {
      const queries = this.$route.query || {};
      console.log(queries);
      if ("operation" in queries && queries.operation === 'addDataSource') {
        if (queries.dataSourceTypeValue === 1) {
          this.kingBase_DS_disabled = false;
          this.excel_DS_disabled = true;
        } else {
          this.kingBase_DS_disabled = true;
          this.excel_DS_disabled = false;
        }
      }

      if ("operation" in queries && queries.operation === 'editDataSource') {
        if (queries.dataSourceTypeValue === 1) {
          this.kingBase_DS_disabled = false;
          this.excel_DS_disabled = true;
        } else {
          this.kingBase_DS_disabled = true;
          this.excel_DS_disabled = false;
        }
        this.getDataSourceById(queries.id);
      }
    },

    // 显示表单遮罩
    showShadow() {
      if (!this.kingBase_DS_disabled) {
        document.querySelector("#kingbase-form-shadow").style.display = "none"
        document.querySelector("#excel-form-shadow").style.display = "block"
      }
      if (!this.excel_DS_disabled) {
        document.querySelector("#kingbase-form-shadow").style.display = "block"
        document.querySelector("#excel-form-shadow").style.display = "none"
      }
    },

    async uploadexceldemo() {
      const {data: res} = await this.$http.request({
        url: '/upload',
        methods: 'post',
      })
    if (res.meta.status === 200) {

        console.log('数据源获取成功')

      } else {
        this.$message.error('数据源获取失败！')
      }
    },
    // 通过Id获取数据源信息
    async getDataSourceById(id) {
      const { data: res } = await this.$http.request({
        url: '/getDataSourceById',
        methods: 'get',
        params: {
          id
        }
      })
      if (res.meta.status === 200) {
        this.DS_kingBase = res.data

        console.log('this.DataSource', this.DS_kingBase)
        console.log('数据源获取成功')

        this.show_DS_info(res.data);
      } else {
        this.$message.error('数据源获取失败！')
      }
    },

    // 数据源信息显示
    show_DS_info(data) {
      if (data.databasetype === 'kingbase') {
        this.form.setFieldsValue({
          ip: data.ip,
          port: data.port,
          username: data.username,
          password: data.password,
          databasename: data.databasename,
          note: data.note
        })
      } else {
        this.fileList.push({
          uid: '1',
          name: data.databasename,
          status: 'done',
          url: data.fileoath
        });
        this.excelDataSourceForm.setFieldsValue({
          filepath: data.file,
          dataSourceName: data.dataSourceName,
          note: data.note
        })
      }
    },

    // 修改金仓数据源
    async editDataSource(values) {
      const { data: res } = await this.$http.request({
        url: '/editDataSource',
        method: 'post',
        params: values
      })
      if (res.meta.status === 200) {
        this.$message.success('保存数据源成功')
        this.form.resetFields();
      } else {
        this.$message.error('保存数据源失败')
      }
    },

    // 改变操作表单
    toggleForm(e) {
      if (e.target.innerHTML.includes('kingBase')) {
        this.excel_DS_disabled = true;
        this.kingBase_DS_disabled= false;
      } else {
        this.excel_DS_disabled = false;
        this.kingBase_DS_disabled= true;
      }
      this.showShadow();
    },

    // 确认保存excel数据源信息提示
    save_excel_DS_confirm() {
      this.excelDataSourceForm.validateFields((err, values) => {
        if (!err) {
          const _this = this
          if (values.note === undefined) {
            values.note = "";
          }
          console.log('Received values of form: ', values)
          this.excelDataSource = values;
          this.$confirm({
            title: '保存excel数据源',
            content: <div style="color:green;">确定保存该excel数据源设置吗？</div>,
            okText: '确定',
            cancelText: '取消',
            onOk() {
              _this.handleUpload()
              // _this.saveExcelDataSource(values)
            },
            onCancel() {
            }
          })
        }
      })
    },

    // 移除已选中的文件
    removeFile(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },

    // 上传前校验
    beforeUpload(file) {
      const isExcel = file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
      console.log(file);
      if (!isExcel) {
        this.$message.error("只能上传excel文件");
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("请上传小于5M的文件");
      }
      if (isExcel && isLt5M) {
        this.fileList = [...this.fileList, file];
      }
      return false;
    },

    // 处理文件上传
    // handleUpload() {
    //   const { fileList } = this;
    //   let formData = new FormData();
    //   console.log(fileList);
    //   fileList.forEach(file => {
    //     console.log(file);
    //     formData.append('file', file)
    //   });
    //   this.uploading = true;
    //   console.log(formData.get('file'));
    //   this.uploadExcelFile(formData);
    // },
    handleUpload() {
      // const { fileList } = this;
      let formData = new FormData();
      // console.log(fileList);
      // fileList.forEach(file => {
      //   console.log(file);
      //   formData.append('file', file)
      // });
      formData.append('file', this.name)
      this.uploading = true;
      console.log(formData.get('file'));
      let config = {
        headers: {
         'Content-Type': 'multipart/form-data'
        }
      }
      this.$http.post('/upload', formData, config).then((res) => {
        if (res.meta.status == 200) {
          const resData = res
          console.log('resData', resData)
          this.fileList = [];
          this.uploading = false;
          this.excelDataSource.filepath = resData.filepath
          console.log(this.excelDataSource);
          this.saveExcelDataSource();
        }
      })
    },

    // 上传excel文件
    async uploadExcelFile(file) {
      this.loading = true;
      console.log(file);
      const { data: res } = await this.$http.request({
        url: '/upload',
        method: 'post',
        processData: false,
        data: {
          file
        },
      })
      if (res.meta.status == 200) {
        const resData = res
        console.log('resData', resData)
        this.fileList = [];
        this.uploading = false;
        this.excelDataSource.filepath = resData.filepath
        console.log(this.excelDataSource);
        this.saveExcelDataSource();
      } else {
        this.uploading = false;
        this.$message.error('文件上传失败，请重试')
      }
    },

    // 保存excel数据源信息
    async saveExcelDataSource() {
      const params = this.excelDataSource;
      console.log(params);
      const { data: res } = await this.$http.request({
        url: '/saveDataSourceExcel',
        method: 'post',
        params: params
      })
      if (res.meta.status === 200) {
        this.$message.success('保存excel数据源成功');
        this.loading = false;
        this.excelDataSourceForm.resetFields();
      } else {
        this.$message.error('保存excel数据源失败')
      }
    },
  },
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
.background {
  background-color: #f5f5f5;
}
.shadow {
  position: absolute;
  background-color: #999999;
  height: 100%;
  width: 100%;
  z-index: 10;
  opacity: 0.5;
  display: none;
}
</style>
