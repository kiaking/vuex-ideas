import { createVuex, defineStore } from 'src/index'

describe('unit/vuex', () => {
  it('caches stores, and return it on second call', () => {
    const vuex = createVuex()

    const Counter = defineStore('counter', () => {
      return { count: 1 }
    })

    const counter1 = vuex.store(Counter)
    const counter2 = vuex.store(Counter)

    expect(counter1).toBe(counter2)
  })
})
