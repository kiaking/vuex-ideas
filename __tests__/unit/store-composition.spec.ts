import { ref } from 'vue'
import { createVuex, defineStore } from 'src/index'

describe('unit/option-store', () => {
  it('gets raw option store', () => {
    const vuex = createVuex()

    const counterStore = defineStore({
      name: 'counter',
      state: () => ({
        count: 1
      }),
      getters: {
        double(): number {
          return this.count * 2
        }
      },
      actions: {
        increment(): void {
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

  it('gets reactive option store', () => {
    const vuex = createVuex()

    const counterStore = defineStore({
      name: 'counter',
      state: () => ({
        count: 1
      }),
      getters: {
        double(): number {
          return this.count * 2
        }
      },
      actions: {
        increment(): void {
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

  it('can use another option store', () => {
    const vuex = createVuex()

    const greeter = defineStore({
      name: 'greeter',
      state: () => ({
        greet: 'Hello'
      })
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
