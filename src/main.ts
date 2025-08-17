import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 全局引入字体
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
