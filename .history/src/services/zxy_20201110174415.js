/*
 * @Descripttion: 态势详情，尝试在编辑器工程下新建service
 * @Author: zxy
 * @Date: 2020-07-20 11:15:05
 * @LastEditTime: 2020-11-10 17:44:15
 */
//control + command + i
import request from '../utils/request.js'

// 查询所有组件
export function getAllComponent() {
    return request({
        url: 'getAllComponent',
        method: 'get'
    })
}
// 根据组件id查询组件信息
export function getChartOption(params) {
    return request({
        url: 'getComponentOption',
        method: 'get',
        data: { chartId: params }
    })
}
// 组件新增标题保存
export function saveAddComponent(params) {
    return request({
        url: 'saveComponentTitle',
        method: 'post',
        data: params
    })
}
// 态势详情保存
export function saveTSDetail(params) {
    return request({
        url: 'saveTSDetail',
        method: 'post',
        data: params
    })
}
//态势详情回显示传参
export function detailTS(params) {
    return request({
        url: 'detailTS',
        method: 'get',
        data: { id: params }
    })
}
//新增组件模糊搜索
export function getComponentByName(params) {
    return request({
        url: 'getComponentByName',
        method: 'get',
        data: { chartName: params }
    })
}
//态势详情删除组件
export function deleteTSComonent(params) {
    return request({
        url: 'deleteTSComonent',
        method: 'get',
        data: {
            id: params
        }
    })
}