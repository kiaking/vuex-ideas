import { ref, computed } from 'vue'
import { defineStore } from 'vuex'

export default defineStore('counter', () => {
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
