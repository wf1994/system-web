/*
 * @Descripttion:
 * @Author: zxy
 * @Date: 2020-07-02 22:47:45
 * @LastEditTime: 2020-12-03 16:18:59
 */
import { Modal } from 'ant-design-vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Analysis from '../components/Analysis.vue'
import Baseinfo from '../components/Baseinfo.vue'
import Chuku from '../components/Chuku.vue'
import Customer from '../components/Customer.vue'
import Finance from '../components/Finance.vue'
import MyLayout from '../components/MyLayout.vue'
import Ruku from '../components/Ruku.vue'
import Supplier from '../components/Supplier.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/baseinfo',
    component: MyLayout,
    children: [
      // {
      //   path: '/dataSource',
      //   component: DataSource
      // }
    
      {
        path: '/baseinfo',
        component: Baseinfo
      },
      {
        path: '/ruku',
        component: Ruku
      },
      {
        path: '/chuku',
        component: Chuku
      },
      {
        path: '/supplier',
        component: Supplier
      },
      {
        path: '/customer',
        component: Customer
      },
      {
        path: '/analysis',
        component: Analysis
      },
      {
        path: '/finance',
        component: Finance
      },
    ]
  }
]

const router = new VueRouter({
  routes
})
// 导航守卫
router.beforeEach((to, from, next) => {
  // 路由前进、后退销毁提示框
  Modal.destroyAll()
  next()
})

export default router
