import './styles/variables.css'
import './styles/base.css'

import { createApp } from 'vue'
import { createVuex } from '/@vuex/'
import App from './App.vue'

const app = createApp(App)

const vuex = createVuex()

app.use(vuex)

app.mount('#app')
