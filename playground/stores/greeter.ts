import { ref, computed, ComputedRef } from 'vue'
import { defineStore } from '../../src'
import counterStore from './counter'
import counterOStore from './counter-option'

export default defineStore('greeter', use => {
  const counter = use(counterStore)
  const co = use(counterOStore)

  const greet = ref('Hello')

  counter.double
  co.state

  const greetWithCount: ComputedRef<string> = computed(() => {
    return `${greet.value} ${counter.count.value}`
  })

  return {
    greet,
    greetWithCount
  }
})
