import { ref, computed } from 'vue'
import { createVuex, defineStore } from 'src/index'

describe('feature/composition-store', () => {
  it('creates store by composition syntax', () => {
    const vuex = createVuex()

    const counterStore = defineStore('counter', () => {
      const count = ref(1)
      const double = computed(() => count.value * 2)
      const increment = () => { count.value++ }
      return { count, double, increment }
    })

    const counter = vuex.store(counterStore)

    expect(counter.count.value).toBe(1)
    expect(counter.double.value).toBe(2)

    counter.increment()

    expect(counter.count.value).toBe(2)
    expect(counter.double.value).toBe(4)
  })
})
