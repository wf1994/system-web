/*
 * @Descripttion: 
 * @Author: zxy
 * @Date: 2020-07-02 22:47:45
 * @LastEditTime: 2020-08-28 16:16:37
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { Modal } from 'ant-design-vue'
import MyLayout from '../layout/MyLayout.vue'
import DataSource from '../view/dataSource/DataSource.vue'
import DataSourceList from '../view/dataSource/DataSourceList.vue'
import DataSet from '../view/dataSet/DataSet.vue'
import DataDimension from '../view/dataDimension/DataDimension.vue'
import ComponentSet from '../view/componentSet/ComponentSet.vue'
import StatisItem from '../view/statisItem/StatisItem.vue'
import ComponentAdd from '../view/componentAdd/ComponentAdd.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dataSourceList',
    component: MyLayout,
    children: [
      // {
      //   path: '/dataSource',
      //   component: DataSource
      // },
      {
        path: '/dataSourceset',
        component: DataSource
      },
      {
        path: '/dataSourceList',
        component: DataSourceList
      },
      {
        path: '/dataSet',
        component: DataSet
      },
      {
        path: '/dataDimension',
        component: DataDimension
      },
      {
        path: '/componentSet',
        component: ComponentSet
      },
      {
        path: '/statisItem/:id',
        component: StatisItem
      },
      {
        path: '/statisList',
        component: () => import("../view/statisItem/statisList.vue")
      },
      {
        path: '/componentAdd/:id',
        component: ComponentAdd
      }
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
