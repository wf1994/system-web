<template>
  <a-layout>
    <!-- 头部区域 -->
    <a-layout-header class="header">
      <img width="60" weight="35" src="../assets/logo.png" alt="" />
      <span>综合管理系统</span>
 
  			<router-link to="/baseinfo" class="title" exact>基本信息管理</router-link>
  			<router-link to="/ruku" class="title" exact>入库管理</router-link>
  			<router-link to="/chuku" class="title" exact>出库管理</router-link>
  			<router-link to="/supplier" class="title" exact>供应商管理</router-link>
        <router-link to="/customer" class="title" exact>客户管理</router-link>
  			<router-link to="/analysis" class="title" exact>分析辅助管理</router-link>
  			<router-link to="/finance" class="title" exact>财务核算</router-link>
  
    </a-layout-header>
    <a-layout>
      <!-- 侧边栏，菜单区域 -->
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
      activePath: '/baseinfo', // 当前点击路由
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
//导航栏

a{
	color: #fff;/*设置字体颜色*/
	text-decoration: none;/*消除下划线*/
	padding: 12px;
	border-radius: 5px;
}

/*选中则发生一些变化*/
.router-link-active{
	background: rgba(255,255,255,0.8);
	color: #444;
}
</style>
