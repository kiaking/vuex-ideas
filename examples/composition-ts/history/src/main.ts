import './index.css'

import { createApp } from 'vue'
import { createVuex, history } from '/@vuex/'
import App from './App.vue'

const app = createApp(App)

const vuex = createVuex({
  plugins: [history()]
})

app.use(vuex)

app.mount('#app')
