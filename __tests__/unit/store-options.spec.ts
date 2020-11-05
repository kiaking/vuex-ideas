import { ref } from 'vue'
import { createVuex, defineStore } from 'src/index'

describe('unit/options-store', () => {
  it('gets raw options store', () => {
    const vuex = createVuex()

    const counterStore = defineStore({
      name: 'counter',
      state: () => ({
        count: 1
      }),
      getters: {
        double() {
          return this.count * 2
        }
      },
      actions: {
        increment() {
          this.count++
        }
      }
    })

    const counter = vuex.raw(counterStore)

    expect(counter.count).toBe(1)
    expect(counter.double).toBe(2)

    counter.increment()

    expect(counter.count).toBe(2)
    expect(counter.double).toBe(4)
  })

  it('gets reactive options store', () => {
    const vuex = createVuex()

    const counterStore = defineStore({
      name: 'counter',
      state: () => ({
        count: 1
      }),
      getters: {
        double() {
          return this.count * 2
        }
      },
      actions: {
        increment() {
          this.count++
        }
      }
    })

    const counter = vuex.store(counterStore)

    expect(counter.count).toBe(1)
    expect(counter.double).toBe(2)

    counter.increment()

    expect(counter.count).toBe(2)
    expect(counter.double).toBe(4)
  })

  it('gets reactive options store', () => {
    const vuex = createVuex()

    const counterStore = defineStore({
      name: 'counter',
      state: () => ({
        count: 1
      }),
      getters: {
        double() {
          return this.count * 2
        }
      },
      actions: {
        increment() {
          this.count++
        }
      }
    })

    const counter = vuex.store(counterStore)

    expect(counter.count).toBe(1)
    expect(counter.double).toBe(2)

    counter.increment()

    expect(counter.count).toBe(2)
    expect(counter.double).toBe(4)
  })

  it.only('can watch states', (done) => {
    const vuex = createVuex()

    const Counter = defineStore({
      name: 'counter',
      state: () => ({
        count: 1
      }),
      watch: {
        count(value) {
          expect(value).toBe(2)
          done()
        }
      },
      actions: {
        increment() {
          this.count++
        }
      }
    })

    const counter = vuex.store(Counter)

    expect(counter.count).toBe(1)

    counter.increment()
  })

  it('can use another composition store', () => {
    const vuex = createVuex()

    const greeter = defineStore('greeter', () => {
      const greet = ref('Hello')
      return { greet }
    })

    const counterStore = defineStore({
      name: 'counter',
      use: () => ({
        greeter
      }),
      getters: {
        countWithGreet() {
          return `${this.greeter.greet} 1`
        }
      }
    })

    const counter = vuex.raw(counterStore)

    expect(counter.countWithGreet).toBe('Hello 1')
  })
})
