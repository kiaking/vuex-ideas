import { createApp } from 'vue'
import vuex from './stores'
import App from './App.vue'

const app = createApp(App)

app.use(vuex)

app.mount('#app')
