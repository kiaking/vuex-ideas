import { ref } from 'vue'
import { createVuex, defineStore } from 'src/index'

describe('unit/store-options', () => {
  it('gets raw options store', () => {
    const vuex = createVuex()

    const counterStore = defineStore({
      key: 'counter',
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
      key: 'counter',
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
      key: 'counter',
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

  it('can have watcher', (done) => {
    const vuex = createVuex()

    const Counter = defineStore({
      key: 'counter',
      state: () => ({
        count: 1
      }),
      watch: {
        count(value, oldValue) {
          expect(value).toBe(2)
          expect(oldValue).toBe(1)
          done()
        }
      },
      actions: {
        increment() {
          this.count++
        }
      }
    })

    vuex.store(Counter).increment()
  })

  it('can have string watcher', (done) => {
    const vuex = createVuex()

    const Counter = defineStore({
      key: 'counter',
      state: () => ({
        count: 1
      }),
      watch: {
        count: 'handler'
      },
      actions: {
        handler(value: number, oldValue: number) {
          expect(value).toBe(2)
          expect(oldValue).toBe(1)
          done()
        },

        increment() {
          this.count++
        }
      }
    })

    vuex.store(Counter).increment()
  })

  it('can have object watcher', (done) => {
    const vuex = createVuex()

    const Counter = defineStore({
      key: 'counter',
      state: () => ({
        nested: {
          value: 1
        }
      }),
      watch: {
        nested: {
          handler(value, oldValue) {
            expect(value.value).toBe(2)
            expect(oldValue.value).toBe(2)
            done()
          },
          deep: true
        }
      },
      actions: {
        increment() {
          this.nested.value++
        }
      }
    })

    vuex.store(Counter).increment()
  })

  it('can have object watcher wirh string handler', (done) => {
    const vuex = createVuex()

    const Counter = defineStore({
      key: 'counter',
      state: () => ({
        count: 1
      }),
      watch: {
        count: {
          handler: 'handler'
        }
      },
      actions: {
        handler(value: number, oldValue: number) {
          expect(value).toBe(2)
          expect(oldValue).toBe(1)
          done()
        },

        increment() {
          this.count++
        }
      }
    })

    vuex.store(Counter).increment()
  })

  it('can have array watcher', (done) => {
    const vuex = createVuex()

    const Counter = defineStore({
      key: 'counter',
      state: () => ({
        count: 1
      }),
      watch: {
        count: ['handler']
      },
      actions: {
        handler(value: number, oldValue: number) {
          expect(value).toBe(2)
          expect(oldValue).toBe(1)
          done()
        },

        increment() {
          this.count++
        }
      }
    })

    vuex.store(Counter).increment()
  })

  it('can use another composition store', () => {
    const vuex = createVuex()

    const greeter = defineStore('greeter', () => {
      const greet = ref('Hello')
      return { greet }
    })

    const counterStore = defineStore({
      key: 'counter',
      use: () => ({
        greeter
      }),
      getters: {
        countWithGreet() {
          return `${this.greeter.greet} 1`
        }
      }
    })

    const counter = vuex.store(counterStore)

    expect(counter.countWithGreet).toBe('Hello 1')
  })
})
