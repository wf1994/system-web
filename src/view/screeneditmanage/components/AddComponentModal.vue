<template>
  <a-modal
    :visible="visiable"
    title="新增组件"
    width="40%"
    @cancel="hideModal"
    cancelText="取消"
    okText="确定"
    @ok="saveModal"
  >
    <a-form-model
      :model="addComponentForm"
      ref="addComponentFormRef"
      :rules="addComponentFormRules"
    >
      <a-form-model-item
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        label="标题"
        prop="component_title"
      >
        <a-input
          v-model="addComponentForm.component_title"
          :style="{ width: '360px', height: '32px', marginLeft: '80px' }"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-input
          class="search"
          placeholder="请输入组件名称查询"
          v-model="searchComponentName"
          allow-clear
          @change="clearSearchComponentName"
          :style="{ width: '296px', height: '32px', marginLeft: '28%' }"
        ></a-input>
        <a-button @click="searchByComponentName" type="primary">查询</a-button>
      </a-form-model-item>
      <a-form-model-item
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        label="选择组件"
        prop="component_chartOption"
      >
        <a-select
          v-model="addComponentForm.component_chartOption"
          placeholder="请选择图形"
          @change="getOption"
          :style="{ width: '360px', height: '32px', marginLeft: '80px' }"
        >
          <a-select-option v-for="item in chartOptionData" :key="item.value">{{
            item.label
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <div
      id="miniPic"
      :style="{
        width: '380px',
        height: '300px',
        marginLeft: '25%'
      }"
    >
      缩略图
    </div>

    <!-- <a-button @click="addDiv">add div</a-button>
    <div
      id="zxyBox"
      :style="{
        height: '600px',
        width: '802px',
        border: '1px solid black',
        position: 'relative'
      }"
    ></div> -->
  </a-modal>
</template>

<script>
import {
  saveAddComponent,
  getAllComponent,
  getChartOption,
  getComponentByName
} from '../../../services/zxy.js'
export default {
  components: {},
  props: {
    tsListlId: Number,
    visiable: Boolean,
    handleCancel: Function,
    addItem: Function,
    componentCateList: Array
  },
  data() {
    return {
      //测试allDraw画图
      drawAllOption: [
        {
          chartId: 2,
          chartName: {
            tooltip: {
              show: true,
              trigger: 'axis',
              axisPointer: { type: 'shadow' }
            },
            grid: { borderWidth: 0 },
            legend: {
              textStyle: {
                fontSize: 12,
                fontFamily: '微软雅黑',
                color: '#272727',
                fontWeight: 'bold'
              },
              selectedMode: true,
              show: true,
              left: 'right',
              top: '5%'
            },
            dataset: {
              source: [
                ['product', 'standardNum'],
                ['单位2', '2'],
                ['单位1', '3']
              ]
            },
            xAxis: [
              {
                axisTick: { show: false },
                type: 'category',
                axisLabel: {
                  rotate: 0,
                  interval: 'auto',
                  textStyle: {
                    fontSize: 12,
                    fontFamily: '微软雅黑',
                    color: '#272727',
                    fontWeight: 'bold'
                  }
                },
                splitLine: { show: false },
                axisLine: { lineStyle: { color: '#272727' } },
                positionOffset: { x: 0, y: 0 },
                isShowXAxisText: false
              }
            ],
            yAxis: [
              {
                type: 'value',
                axisLabel: {
                  textStyle: {
                    fontSize: 12,
                    fontFamily: '微软雅黑',
                    color: '#272727',
                    fontWeight: 'bold'
                  },
                  formatter: '{value}'
                },
                nameTextStyle: {
                  fontSize: 12,
                  fontFamily: '微软雅黑',
                  color: '#272727',
                  fontWeight: 'bold'
                },
                splitLine: { show: true },
                axisLine: { lineStyle: { color: '#272727' } },
                name: ''
              }
            ],
            series: [{ name: '', type: 'bar' }]
          }
        }
      ],
      currentOption: {}, //画图option
      //下拉框测试数据
      // chartOptionData: [
      //   {
      //     value: 1,
      //     label: '图1'
      //   },
      //   {
      //     value: 2,
      //     label: '图2'
      //   }
      // ],
      chartOptionData: [],
      // 新增组件表单数据
      addComponentForm: {
        component_title: '',
        component_chartOption: ''
      },
      //表单校验规则
      addComponentFormRules: {
        component_title: [
          { required: true, message: '请输入组件标题', trigger: 'blur' }
        ],
        component_chartOption: [
          { required: true, message: '请选择图表', trigger: 'change' }
        ]
      },
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      saveTitleModal: {
        // tsId: 3,
        tsId: parseInt(this.tsListlId),
        chartId: '',
        title: ''
      },
      searchComponentName: '', // 查询组件名称
      searchFlag: true //默认为true，搜索确认按钮点击后为false
    }
  },
  created() {
    //每次created时clear图片
    let myChart
    myChart = this.$echarts.init(document.getElementById('miniPic'))
    myChart.clear()
    // console.log('clear执行过了');
  },
  mounted() {
    // if (this.searchFlag) {
    this.getComponent()
    // }
    console.log('子组件获取tsListlId=====')
    console.log(this.tsListlId)
  },
  methods: {
    addDiv() {
      //测试生成div
      // let aBtn = document.getElementsByTagName('input')
      let myBox = document.getElementById('zxyBox')
      let str = ''
      let num = 0
      let idNum = 0
      // let flag = 0
      let aColor = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray']
      num = 10
      this.$message.success('----')

      for (let i = 0; i < num; i++) {
        for (let j = 0; j < 4; j++) {
          str +=
            '<div id=miniPic' +
            idNum +
            ' style = "left:' +
            j * 202 +
            'px;top:' +
            (i % 10) * 55 +
            'px;background-color:' +
            aColor[i % aColor.length] +
            ';width:' +
            200 +
            'px;height:' +
            200 +
            'px;display:inline-block;"></div>'
          idNum++
        }

        // str +=
        //   `<div :style="{top: '${Math.floor(i / 10) * 55}px', left: '${(i % 10) * 55}px', backgroundColor: '${aColor[i % aColor.length]}'}"></div>`;
      }

      // for (let i = 0; i < num; i++) {
      //   str +=
      //     '<div style = "left:' +
      //     Math.floor(i / 10) * 55 +
      //     'px;top:' +
      //     (i % 10) * 55 +
      //     'px;background-color:' +
      //     aColor[i % aColor.length] +
      //     ';width:'+200+'px;height:'+200+'px;"></div>'
      //   // str +=
      //   //   `<div :style="{top: '${Math.floor(i / 10) * 55}px', left: '${(i % 10) * 55}px', backgroundColor: '${aColor[i % aColor.length]}'}"></div>`;
      // }
      myBox.innerHTML = str
      this.drawAll()
    },
    drawAll() {
      // console.log('====---:', this.drawAllOption[0].chartName)
      let length = this.drawAllOption.length
      for (let i = 0; i < length; i++) {
        // console.log('每次打印下option：', this.drawAllOption[i].chartName)
        let myChart
        myChart && myChart.dispose()
        myChart = this.$echarts.init(document.getElementById(`miniPic${i}`))
        myChart.clear()
        myChart.setOption(JSON.parse(this.drawAllOption[i]))
      }
    },
    // 新增组件Modal关闭
    hideModal() {
      this.$refs.addComponentFormRef.resetFields()
      this.handleCancel()
    },
    //画图
    drawMychart(option) {
      //初始化echarts实例
      let myChart
      myChart && myChart.dispose()
      myChart = this.$echarts.init(document.getElementById('miniPic'))
      //每次出图前先清理之前的setOption的数据
      myChart.clear()
      myChart.setOption(option)
    },
    //获取所有组件
    async getComponent() {
      const res = await getAllComponent()
      if (!res.success) {
        return this.$message.error('获取数据失败')
      }
      this.$message.success(res.msg)
      this.chartOptionData = res.data.map(item => {
        return {
          value: item.chartId,
          label: item.chartName
        }
      })
    },
    //根据组件ID获取option
    async getOption(value) {
      console.log('根据组件ID：', value)
      const res = await getChartOption(value)
      if (!res.success) {
        return this.$message.error('获取option失败')
      }
      this.$message.success(res.msg)
      // console.log('查询option：', res.data)
      this.currentOption = res.data.chartName
      this.drawMychart(JSON.parse(this.currentOption))
      this.$emit('getChildOption', this.currentOption)
      this.$emit('componentUsedID', value)
    },
    // 保存modal
    saveModal() {
      this.$refs.addComponentFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        this.saveTitleModal.chartId = parseInt(
          this.addComponentForm.component_chartOption
        )
        this.saveTitleModal.title = this.addComponentForm.component_title
        const res = await saveAddComponent(this.saveTitleModal)
        if (!res.success) {
          return this.$message.error('保存失败')
        }
        this.$emit('keyId', res.id)
        this.$message.success('新增组件成功')
        this.addItem()
        this.hideModal()
        setTimeout(() => {
          let myChart
          myChart = this.$echarts.init(document.getElementById('miniPic'))
          myChart.clear()
        }, 100)
      })
    },
    //测试用的保存modal
    addComponentData() {
      this.addItem()
      this.hideModal()
    },
    //按照组件名称模糊搜索
    async searchByComponentName() {
      this.searchFlag = false
      const res = await getComponentByName(this.searchComponentName)
      // console.log('搜索回掉参数：', this.searchComponentName)
      if (!res.success) {
        return this.$message.error('获取数据失败')
      }
      this.$message.success('搜索成功')
      this.chartOptionData = res.data.map(item => {
        return {
          value: item.chartId,
          label: item.chartName
        }
      })
    },
    // 清除查询组件名称
    clearSearchComponentName(e) {
      this.searchFlag = true
      if (e.type === 'click') {
        this.searchComponentName = ''
        this.getComponent()
      }
    }
  },
  computed: {},
  watch: {},
  template: '<AddComponentModal />'
}
</script>
<style scoped>
#zxyBox div {
  width: 50px;
  height: 50px;
  position: absolute;
}
</style>
