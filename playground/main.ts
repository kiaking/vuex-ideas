import { createApp } from 'vue'
import vuex from './stores'
import counterStore from './stores/counter'
import counterOptionStore from './stores/counter-option'
import App from './App.vue'

const app = createApp(App)

app.use(vuex)

const c = vuex.store(counterStore)
console.log('Main C', c)
// console.log(c.count)
// console.log(c.double)
// c.increment()
// console.log(c.count)
// console.log(c.double)

const co = vuex.store(counterOptionStore)
console.log(vuex)
console.log('Main CO', co)
console.log(co.count)
console.log(co.greeterO.counter.count)
// console.log(co.greeterO.greet)
// console.log(co.greeterO.other.yoyoyo)
// console.log(co.double)
co.increment()
console.log(co.count)
console.log(co.greeterO.counter.count)
// console.log(co.double)

app.mount('#app')
