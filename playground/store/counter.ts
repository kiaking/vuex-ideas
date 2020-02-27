import { ref, computed } from 'vue'
import { createStore } from '../../src'
import greeter from './greeter'

const counter = createStore({
  setup() {
    const count = ref(1)

    const double = computed(() => {
      const { greet } = greeter
      console.log(greet)
      return count.value * 2
    })

    function increment() {
      const { greet } = greeter
      console.log(greet)
      count.value++
    }

    return {
      count,
      double,
      increment
    }
  }
})

export default counter
