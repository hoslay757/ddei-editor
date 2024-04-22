import './utils/flexible.js';
import './assets/main.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import './assets/fonts/iconfont/iconfont.css'
import './assets/fonts/iconfont/iconfont.js'
const app = createApp(App)
app.use(router)
app.mount('#app')
window.$app = app
