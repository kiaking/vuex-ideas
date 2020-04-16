import { createVuex, defineStore } from 'src/index'

describe('unit/vuex', () => {
  it('caches stores, and return it on second call', () => {
    const vuex = createVuex()

    const counterStore = defineStore('counter', () => {
      return { count: 1 }
    })

    const counter1 = vuex.store(counterStore)
    const counter2 = vuex.store(counterStore)

    expect(counter1).toBe(counter2)
  })
})
