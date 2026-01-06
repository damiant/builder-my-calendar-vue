import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import * as Icons from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'ant-design-vue/dist/reset.css'
import './style.css'
import App from './App.vue'

// Set dayjs locale
dayjs.locale('en')

const app = createApp(App)
const pinia = createPinia()

// Register Pinia
app.use(pinia)

// Register Ant Design Vue
app.use(Antd)

// Register all icons globally
const iconsList: (keyof typeof Icons)[] = [
  'CalendarOutlined',
  'PlusOutlined',
  'SyncOutlined',
  'CloudOutlined',
  'CloudUploadOutlined',
  'CloudDownloadOutlined',
  'WifiOutlined',
  'LeftOutlined',
  'RightOutlined',
  'CloseOutlined',
  'DeleteOutlined',
  'EditOutlined',
  'CheckOutlined',
  'ClockCircleOutlined',
  'HomeOutlined',
  'LaptopOutlined',
  'TagOutlined',
  'FileTextOutlined',
  'ExclamationCircleOutlined'
]

iconsList.forEach(iconName => {
  const icon = Icons[iconName]
  if (icon && typeof icon !== 'string') {
    app.component(iconName, icon)
  }
})

app.mount('#app')
