/*
 *@description: 对axios进行封装，把拖拽大屏迁移到编辑器中
 *@author: 13uncle
 *@date: 2020-07-07 10:35:31
 *@email: vicvi@foxmail.com
 */
import axios from 'axios'
import router from '../router'
import qs from 'qs'
// 状态码消息提示
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

/**
 * @functionName: fetch
 * @param options    Object    {url:'/api/mock',data:{}, method:'get'}
 * @description: 对请求统一处理，并发送
 * @author: 13uncle
 * @date: 2020-07-07 10:54:54
 * @email: vicvi@foxmail.com
 */
const fetch = options => {
  let { method = 'get', url, data } = options
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: data
      })
    case 'delete':
      return axios.delete(url, {
        data
      })
    case 'post':
      // var paramszxy = JSON.stringify(data)
      return axios.post(url, null, {
        params: data,
        paramsSerializer: params => {
          return qs.stringify(params, { indices: false })
        }
      })
    // return axios.post(url, data = params)
    // return axios.post(url, {params: data})
    case 'put':
      return axios.put(url, data)
    default:
      return axios(options)
  }
}
/**
    封装请求方法
*/
export default function request(options) {
  // console.log('options', options)
  return fetch(options)
    .then(response => {
      /**
        response为后台返回数据，
        统一处理输出格式为
        {success: true, statusCode, msg}
      */
      //  console.log('=====')
      const { status } = response
      // console.log('response', response)
      let data = response.data
      if (status === 200) {
        // 0: 成功返回，并存在数据，-1：成功返回，查询为空
        if (data.code === '0' || data.code === '-1') {
          return Promise.resolve({
            success: true,
            msg: data.msg,
            statusCode: status,
            ...data
          })
        } else {
          return router.push('/')
          // 清空sessionStorage
        }
      }
      return Promise.reject({
        success: false,
        msg: data.msg || codeMessage[status],
        statusCode: status
      })
    })
    .catch(error => {
      return Promise.reject({
        success: false,
        msg: error
      })
    })
}
axios.defaults.baseURL = 'http://127.0.0.1:8080/api/'
// 请求超时前，等待15s
axios.defaults.timeout = 15000
// 配置post请求，请求头，可能不需要
// axios.defaults.headers.post['Content-Type'] =
//   'application/x-www-form-urlencoded'
// axios.defaults.headers.post['Content-Type'] = 'application/json'

/**
    请求拦截器
*/
axios.interceptors.request.use(config => {
  // 登录时时候，请求携带token
  // config.headers.Authorization = window.sessionStorage.getItem('token')

  // 登录时时候，将user_id保存到sessionStorage中,在此获取并添加到header中
  // config.headers.user_id = 0
  //现在不用登陆，保存用户信息，所以直接去掉，如果以后需要做登录，后端的cors设置要做些改变

  // post请求，将参数转为JSON字符串
  // if (config.method === 'post') {
  // config.params = JSON.stringify(config.params)
  // config.data = JSON.stringify(config.data)
  //   console.log('config:', config)
  // }
  return config
})
