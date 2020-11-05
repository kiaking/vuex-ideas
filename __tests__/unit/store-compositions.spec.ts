import { ref, computed, watch } from 'vue'
import { createVuex, defineStore } from 'src/index'

describe('unit/composition-store', () => {
  it('gets raw composition store', () => {
    const vuex = createVuex()

    const Counter = defineStore('counter', () => {
      const count = ref(1)
      const double = computed(() => count.value * 2)
      const increment = () => count.value++

      return { count, double, increment }
    })

    const counter = vuex.raw(Counter)

    expect(counter.count.value).toBe(1)
    expect(counter.double.value).toBe(2)

    counter.increment()

    expect(counter.count.value).toBe(2)
    expect(counter.double.value).toBe(4)
  })

  it('gets reactive composition store', () => {
    const vuex = createVuex()

    const Counter = defineStore('counter', () => {
      const count = ref(1)
      const double = computed(() => count.value * 2)
      const increment = () => count.value++

      return { count, double, increment }
    })

    const counter = vuex.store(Counter)

    expect(counter.count).toBe(1)
    expect(counter.double).toBe(2)

    counter.increment()

    expect(counter.count).toBe(2)
    expect(counter.double).toBe(4)
  })

  it('can watch states', (done) => {
    const vuex = createVuex()

    const Counter = defineStore('counter', () => {
      const count = ref(1)

      watch(count, (value) => {
        expect(value).toBe(2)
        done()
      })

      const increment = () => count.value++

      return { count, increment }
    })

    const counter = vuex.store(Counter)

    counter.increment()
  })

  it('can use another composition store', () => {
    const vuex = createVuex()

    const Greeter = defineStore('greeter', () => {
      const greet = ref('Hello')

      return { greet }
    })

    const Counter = defineStore('counter', ({ use }) => {
      const greeter = use(Greeter)
      const countWithGreet = computed(() => `${greeter.greet.value} 1`)

      return { countWithGreet }
    })

    const counter = vuex.raw(Counter)

    expect(counter.countWithGreet.value).toBe('Hello 1')
  })

  it('can use another option store', () => {
    const vuex = createVuex()

    const Greeter = defineStore({
      name: 'greeter',
      state: () => ({
        greet: 'Hello'
      })
    })

    const Counter = defineStore('counter', ({ use }) => {
      const greeter = use(Greeter)
      const countWithGreet = computed(() => `${greeter.greet} 1`)

      return { countWithGreet }
    })

    const counter = vuex.raw(Counter)

    expect(counter.countWithGreet.value).toBe('Hello 1')
  })
})