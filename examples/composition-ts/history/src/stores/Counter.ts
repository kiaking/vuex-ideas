import { ref, computed } from 'vue'
import { defineStore } from '/@vuex/'

function sleep () {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

export default defineStore('counter', () => {
  const count = ref(1)

  const double = computed(() => count.value * 2)

  function increment () {
    count.value++
  }

  function decrement () {
    count.value--
  }

  return {
    count,
    double,
    increment,
    decrement
  }
})
