import { ref, computed, ComputedRef } from 'vue'
import { defineStore } from '../../src'
import greeterStore from './greeter'

export default defineStore('counter', use => {
  const greeter = use(greeterStore)

  const count = ref(1)

  const countWithGreet: ComputedRef<string> = computed(() => {
    return `${count.value} ${greeter.greet.value}`
  })

  return {
    count,
    countWithGreet
  }
})
