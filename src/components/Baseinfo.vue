<template>
<a-layout>
    <!-- 头部区域 -->
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
          <a-menu-item key="/baseinfo" title="公司信息">
            <a-icon type="code-sandbox" />
            <span>公司信息</span>
          </a-menu-item>
		  <a-menu-item key="/baseinfo" title="员工信息">
            <a-icon type="code-sandbox" />
            <span>员工信息</span>
          </a-menu-item>
		  <a-menu-item key="/baseinfo" title="客户信息">
            <a-icon type="code-sandbox" />
            <span>客户信息</span>
          </a-menu-item>
		  <a-menu-item key="/baseinfo" title="供应商信息">
            <a-icon type="code-sandbox" />
            <span>供应商信息</span>
          </a-menu-item>
		  		  <a-menu-item key="/baseinfo" title="商品管理">
            <a-icon type="code-sandbox" />
            <span>商品管理</span>
          </a-menu-item>
		        </a-menu>
      </a-layout-sider>
	
      <a-layout style="padding: 0 24px 24px">
        <!-- 面包屑区域 -->
        <a-breadcrumb style="margin: 16px 0">
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
</style>
