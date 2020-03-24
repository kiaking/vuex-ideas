import { ref, computed } from 'vue'
import { defineStore } from '../../src'

export default defineStore('counter', (use) => {
  const count = ref(1)

  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return {
    count,
    double,
    increment
  }
})
