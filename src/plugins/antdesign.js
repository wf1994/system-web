import Vue from 'vue'
import {
  Button,
  Layout,
  Menu,
  Icon,
  Breadcrumb,
  Row,
  Col,
  Form,
  Input,
  Select,
  Table,
  Pagination,
  Modal,
  Message,
  Dropdown,
  Tabs,
  Radio,
  FormModel,
  Checkbox,
  Slider,
  Upload
} from 'ant-design-vue'
import '../theme.less'
// 全局注册antd组件
Vue.use(Button)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Breadcrumb)
Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(Input)
Vue.use(Select)
Vue.use(Table)
Vue.use(Pagination)
Vue.use(Modal)
Vue.use(Dropdown)
Vue.use(Tabs)
Vue.use(Radio)
Vue.use(FormModel)
Vue.use(Checkbox)
Vue.use(Slider)
Vue.use(Upload)

Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$message = Message
