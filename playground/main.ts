import { createApp } from 'vue'
import vuex from './stores'
import counterStore from './stores/counter'
import counterOptionStore from './stores/counter-option'
import App from './App.vue'

const app = createApp(App)

app.use(vuex)

const c = vuex.store(counterStore)

c.count
c.double
c.increment

const co = vuex.store(counterOptionStore)

co.state
console.log(co)
co.increment()
co.increment()
co.increment()

app.mount('#app')
