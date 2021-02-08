import './index.css'

import { createApp } from 'vue'
import { createVuex } from '/@vuex/'
import { useCounter } from './stores/Counter'
import App from './App.vue'

const app = createApp(App)

const vuex = createVuex()

const counter = vuex.store(useCounter)

console.log(counter.count)
console.log(counter.double)
counter.increment()
console.log(counter.count)
console.log(counter.double)

app.use(vuex)

app.mount('#app')
