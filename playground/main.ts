import { createApp } from 'vue'
import vuex from './stores'
import counterStore from './stores/counter'
import counterOptionStore from './stores/counter-option'
import App from './App.vue'

const app = createApp(App)

app.use(vuex)

const c = vuex.store(counterStore)
console.log(c)
// console.log(c.count)
// console.log(c.double)
// c.increment()
// console.log(c.count)
// console.log(c.double)

const co = vuex.store(counterOptionStore)
console.log(co)
console.log(co.state.count)
console.log(co.double)
// co.increment()
// console.log(co.state.count)
// console.log(co.double)

app.mount('#app')
