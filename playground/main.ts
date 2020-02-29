import { createApp } from 'vue'
import vuex from './stores'
import counterStore from './stores/counter'
import counterOptionStore from './stores/counter-option'
// import greeterStore from './stores/greeter'
import App from './App.vue'

const app = createApp(App)

app.use(vuex)

app.mount('#app')

const counter = vuex.store(counterStore)
const counterOption = vuex.store(counterOptionStore)
// const greeter = vuex.store(greeterStore)
console.log(counter)
console.log(counterOption)

console.log(counterOption.state.count)
console.log(counterOption.double())

counterOption.increment()

console.log(counterOption.state.count)
console.log(counterOption.double())

// console.log(counter.count.value)
// console.log(counter.countWithGreet.value)

// console.log(greeter.greet.value)
// console.log(greeter.greetWithCount.value)
