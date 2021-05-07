<template>
  <a-layout>
    <!-- 头部区域 -->
    <a-layout-header class="header">
      <img src="../assets/logo.png" alt="" />
      <span>BI可视化工具系统</span>
    </a-layout-header>
    <a-layout>
      <!-- 侧边栏，菜单区域 -->
      <a-layout-sider width="260" collapsible v-model="collapsed">
        <a-menu
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
          theme="dark"
          @click="linkTo"
          :defaultSelectedKeys="defaultSelectedKeys"
        >
          <a-menu-item key="/dataSourceList" title="数据源设置">
            <a-icon type="code-sandbox" />
            <span>数据源设置</span>
          </a-menu-item>
          <a-menu-item key="/dataSet" title="数据集设置">
            <a-icon type="database" />
            <span>数据集设置</span>
          </a-menu-item>
          <a-menu-item key="/dataDimension" title="维度向量设置">
            <a-icon type="hdd" />
            <span>维度向量设置</span>
          </a-menu-item>
          <a-menu-item key="/statisList" title="统计项设置">
            <a-icon type="project" />
            <span>统计项设置</span>
          </a-menu-item>
          <a-menu-item key="/componentSet" title="组件设置">
            <a-icon type="fund" />
            <span>组件设置</span>
          </a-menu-item>
          <a-menu-item key="/zxyShow" title="毕设测试">
            <a-icon type="fund" />
            <span>三维组件测试</span>
          </a-menu-item>
          <a-menu-item key="/tsdetails/1" title="拖拽大屏">
            <a-icon type="fund" />
            <span>拖拽大屏1</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <!-- 面包屑区域 -->
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>{{ activeBreadcrumb }}</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- 主题内容区域 -->
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            margin: 0,
            height: '100%',
            minHeight: '600px'
          }"
        >
          <!-- 导航视图 -->
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false, // 侧边栏折叠
      activePath: '/dataSourceList', // 当前点击路由
      activeBreadcrumb: window.sessionStorage.getItem('activeBreadcrumb')
    }
  },
  methods: {
    // 点击菜单项跳转事件
    linkTo(link) {
      window.sessionStorage.setItem('activePath', link.key)
      window.sessionStorage.setItem('activeBreadcrumb', link.item.title)
      this.activeBreadcrumb = link.item && link.item.title
      this.$router.push(link.key)
      this.activePath = link.key
    }
  },
  computed: {
    defaultSelectedKeys() {
      const tempPath = [window.sessionStorage.getItem('activePath')]
      return tempPath
    }
  }
}
</script>
<style lang="less" scoped>
.ant-layout {
  height: 100%;
}
.ant-layout-header {
  height: 48px;
  padding: 0 0.8%;
  line-height: 48px;
  color: #fff;
  font-size: 1.125rem;
  background-color: #128075;
}
.header {
  span {
    margin-left: 0.4%;
  }
}
</style>
