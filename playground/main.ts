import { createApp } from 'vue'
import vuex from './stores'
// import counterStore from './stores/counter'
// import greeterStore from './stores/greeter'
import App from './App.vue'

const app = createApp(App)

app.use(vuex)

app.mount('#app')

// const counter = vuex.store(counterStore)
// const greeter = vuex.store(greeterStore)

// console.log(counter.count.value)
// console.log(counter.countWithGreet.value)

// console.log(greeter.greet.value)
// console.log(greeter.greetWithCount.value)
