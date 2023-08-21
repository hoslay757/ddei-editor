import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'


// 完整引入组件库
import WeDesign from '@ddei/ddei-framework';

const app = createApp(App);
// 全局安装
app.use(WeDesign).mount('#app');
