<template>
  <div>
    <!-- <a-row>
      <a-col :span="24">
        <div class="layoutJSON">
          Displayed as
          <code>[x, y, w, h]</code>:
          <div class="columns">
            <div class="layoutItem" v-for="item in layout" :key="item.i">
              <b>{{item.i}}</b>
              : [{{item.x}}, {{item.y}}, {{item.w}}, {{item.h}}]
            </div>
          </div>
        </div>
      </a-col>
    </a-row> -->
    <a-row>
      <a-col>
        <a-button
          class="pull-right add-button2"
          type="primary"
          @click="saveAll"
          v-if="saveButtonShow"
        >保存</a-button>
        <a-button
          class="pull-right add-button1"
          type="primary"
          @click="handleShowAddComponentModal"
          v-if="addButtonShow"
        >新增</a-button>
        <a-button
          id="btn"
          class="pull-right add-button3"
          type="primary"
          v-if="previewFlag"
          @click="enterPreview"
        >全屏预览</a-button>
        <a-button
          class="pull-right add-button"
          type="primary"
          v-if="!previewFlag"
          @click="exitPreview"
        >退出全屏预览</a-button>
        <AddComponentModal
          :tsListlId="tsId"
          :visiable="addComponentVisiable"
          :handleCancel="handleHideAddComponentModal"
          :addItem="addItem"
          :componentCateList="chartOptionData"
          @getChildOption="getComponentOption"
          @componentUsedID="getComponentUsedId"
          @keyId="getKeyId"
        />
      </a-col>
    </a-row>
    <a-row id="previewArea" :style="{backgroundColor:'#fff', opacity:'.9'}">
      <a-col :spam="24">
        <grid-layout
          :layout.sync="layout"
          :col-num="12"
          :row-height="30"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[10, 10]"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in layout"
            :key="item.i"
            :static="false"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            @resize="resizeLayout"
            class="gridItem"
          >
            <a-dropdown v-if="dropdownShow" class="pull-right">
              <a @click="e => e.preventDefault()">
                <a-icon type="ellipsis" />
              </a>
              <a-menu slot="overlay">
                <!-- <a-menu-item @click="editItem(item)">修改</a-menu-item> -->
                <a-menu-item @click="removeItem(item)">删除</a-menu-item>
              </a-menu>
            </a-dropdown>
            <div :style="{width:'98%',height:'99%'}" :id="'myChart'+item.i">{{item.i}}</div>
          </grid-item>
        </grid-layout>
      </a-col>
    </a-row>
  </div>
</template>

<script>
// import nextId from '../../utils/generator.js'
import VueGridLayout from 'vue-grid-layout'
import AddComponentModal from './components/AddComponentModal.vue'
import EleResize from '../../utils/eleresize.js'
import {
  saveTSDetail,
  detailTS,
  getChartOption,
  deleteTSComonent
} from '../../services/zxy.js'
let testLayout = []
// let g = nextId()
export default {
  components: {
    AddComponentModal,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  props: {},
  data() {
    return {
      keyId: 0,
      tsId: 0,
      chartId: 0,
      flagId: 0,
      echoArr: [],
      echoOption: {},
      previewCss: [{ allScreen: false, normalStyle: true }],
      dropdownShow: true, //...是否显示，全屏预览时消失
      saveButtonShow: true,
      addButtonShow: true,
      previewFlag: true,
      layout: JSON.parse(JSON.stringify(testLayout)), //layout布局数组信息
      index: 0, //layout布局数组长度
      addComponentVisiable: false, // 新增组件Modal显示控制
      chartOptionData: [], //基础图表下拉框列表
      layoutUsedList: [], //使用过的ID，主键id
      currentOption: {},
      testOption: {
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          borderWidth: 0
        },
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
            ['product', '人数'],
            ['才能1', 335],
            ['才能2', 310],
            ['才能3', 234],
            ['才能4', 135],
            ['才能5', 548]
          ]
        },
        xAxis: [
          {
            axisTick: {
              show: false
            },
            type: 'category',
            // data : [],  //数据
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
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#272727'
              }
            },
            positionOffset: {
              x: 0,
              y: 0
            },
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
            splitLine: {
              show: true
            },
            axisLine: {
              lineStyle: {
                color: '#272727'
              }
            },
            name: '' //数据
          }
        ],
        series: [
          {
            name: '',
            type: 'bar'
          }
        ]
      },
      saveData: {
        tsId: 0,
        // layoutUsed: [],
        layoutPosition: []
      }
    }
  },
  created() {
    //态势编辑时回显
    this.tsId = this.$route.params.id
  },
  mounted() {
    this.index = this.layout.length
    this.tsEcho()
  },
  methods: {
    previewStyle() {
      //没用到
      if (this.cssFlag === true) {
        this.previewCss[0].allScreen = true
        this.previewCss[0].normalStyle = false
      } else {
        this.previewCss[0].allScreen = false
      }
    },
    previewArea() {
      const ele = document.querySelector('#previewArea')
      const btn = document.querySelector('#btn')
      btn.addEventListener('click', () => {
        if (ele.requestFullscreen) {
          ele.requestFullscreen()
        }
        // FireFox
        else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen()
        }
        //Chrome
        else if (ele.webkitRequestFullScreen) {
          ele.webkitRequestFullScreen()
        }
        //IE11
        else if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen()
        }
      })
    },
    enterPreview() {
      this.previewArea()
    },
    exitPreview() {
      this.dropdownShow = true
      this.saveButtonShow = true
      this.addButtonShow = true
      this.previewFlag = true
    },
    //画图
    drawMychart(option, i) {
      let itemId = i
      let mychart, resizeDiv
      //使用setTimeout异步特性使图标正常加载
      setTimeout(() => {
        this.$nextTick(() => {
          mychart = this.$echarts.init(
            document.getElementById(`myChart${itemId}`)
          )
          resizeDiv = document.getElementById(`myChart${itemId}`)
          mychart.setOption(option)
          let listener = function() {
            mychart.resize()
          }
          EleResize.on(resizeDiv, listener)
        })
      }, 0)
    },
    //新增item
    addItem() {
      let item = {
        x: 0,
        y: 0,
        w: 6,
        h: 9,
        i: this.index,
        chartId: this.chartId,
        id: this.keyId
      }
      this.index++
      this.layout.push(item)
      this.drawMychart(JSON.parse(this.currentOption), item.i)
      this.saveTS()
    },
    //删除item
    removeItem: function(item) {
      this.deleteComonent(item.id)
      this.layout.splice(this.layout.indexOf(item), 1)
      //删除layoutUsedList
      this.layoutUsedList.splice(item.i, 1)
      // console.log('删除后chartId:', this.layoutUsedList)
      
    },
    //grid-layout在resize后输出
    resizeLayout: function(i, newH, newW, newHPx, newWPx) {
      console.log(
        'RESIZE i=' +
          i +
          ', H=' +
          newH +
          ', W=' +
          newW +
          ', H(px)=' +
          newHPx +
          ', W(px)=' +
          newWPx
      )
      //大小自适应
      let timer
      let itemId = i
      clearTimeout(timer)
      timer = setTimeout(() => {
        let myChart = this.$echarts.init(
          document.getElementById(`myChart${itemId}`)
        )
        myChart.resize()
      }, 10)
    },
    // 新增组件Modal显示
    handleShowAddComponentModal() {
      this.addComponentVisiable = true
    },
    // 新增组件Modal关闭
    handleHideAddComponentModal() {
      this.chartOptionData = []
      this.addComponentVisiable = false
    },
    //从子组件获取option
    getComponentOption(option) {
      // console.log('option===========')
      // console.log(option)
      this.currentOption = option
    },
    //使用过的组件的chartId
    getComponentUsedId(id) {
      this.chartId = id
      // console.log(this.layoutUsedList)
    },
    //每个组件保存时的主键id
    getKeyId(value) {
      this.keyId = value
      this.layoutUsedList.push(value)
    },
    //保存态势详情
    saveAll() {
      this.saveTS()
    },
    //态势详情保存提交
    async saveTS() {
      this.saveData.layoutPosition = JSON.stringify(this.layout)
      this.saveData.tsId = parseInt(this.tsId)
      // this.saveData.layoutUsed = JSON.stringify(this.layoutUsedList)
      const res = await saveTSDetail(this.saveData)
      this.$message.success('态势保存成功')
      if (!res.success) {
        return this.$message.error('态势保存失败')
      }
    },
    //态势详情回显
    async tsEcho() {
      const res = await detailTS(this.tsId)
      this.layout = JSON.parse(JSON.stringify(res.data.layoutPosition))
      // this.layoutUsedList = res.data.layoutUsed
      // console.log('回显方法中layoutUsedList====', this.layoutUsedList)
      if (!res.success) {
        return this.$message.errror('回显失败')
      }
      setTimeout(() => {
        let tempArr = this.layout
        // console.log('回显的layoutUsedList:', this.layoutUsedList)
        for (let j = 0; j < tempArr.length; j++) {
          this.echoArr[j] = tempArr[j].chartId
          this.setEchoOption(this.echoArr[j], this.layout[j].i)
        }
      }, 0)
    },
    //回显根据组件ID获取option
    async setEchoOption(value, i) {
      const res = await getChartOption(value)
      let tempOption = res.data.chartName
      this.drawMychart(JSON.parse(tempOption), i)
    },
    //删除组件
    async deleteComonent(id) {
      const res = await deleteTSComonent(id)
      if (!res.success) {
        return this.$message.errror('删除失败')
      }
    }
  },
  computed: {
    // layoutUsedListComputed: function() {
    //   console.log('计算属性中：', this.tsId)
    //   let temp = [2, 3]
    //   return temp
    // }
  },
  watch: {
    layout(newVal) {
      // console.log('watch中的layout:', this.layout)
      this.index = newVal.length
      // console.log('watch中的index',this.index)
      let arr = []
      if (this.index !== 0) {
        for (let j = 0; j < this.layout.length; j++) {
          arr[j] = this.layout[j].i
        }
        this.index = Math.max(...arr) + 1
        // console.log('watch中，下一次新增的i：',this.index)
      }
    },
    immediate: true
  }
}
</script>
<style scoped>
.pull-right {
  float: right;
}
.gridItem {
  background: #fff;
  /* border: 1px solid black; */
  /* box-shadow: 2px 2px 4px #ccc */
  box-shadow: 0px -4px 4px #eee, -4px 0px 4px #eee, 4px 0px 4px #ddd,
    0px 4px 4px #ddd;
}
.layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}
.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 120px;
}
.layoutItem {
  display: block;
}
.add-button1 {
  margin-right: 15px;
  margin-top: 15px;
  position: fixed;
  top: 4%;
  right: 9%;
  z-index: 99;
}
.add-button2 {
  margin-right: 15px;
  margin-top: 15px;
  position: fixed;
  top: 4%;
  right: 5.1%;
  z-index: 99;
}
.add-button3 {
  margin-right: 15px;
  margin-top: 15px;
  position: fixed;
  top: 4%;
  right: 0;
  z-index: 99;
}
.del-button {
  position: fixed;
  right: 0;
  top: 0;
}
.allScreen {
  margin: 0;
  padding: 0;
  width: 100vh;
  height: 100vh;
  position: absolute;
}
.normalStyle {
  background-color: #fff;
}
</style>
