import { createVuex } from 'src/vuex'
import { defineStore } from 'src/store'

describe('unit/vuex', () => {
  it('creates a store from the given store definition', () => {
    const vuex = createVuex()

    const counterStore = defineStore('counter', () => {
      return { count: 1 }
    })

    const counter = vuex.store(counterStore)

    expect(counter.count).toBe(1)
  })

  it('caches stores, and return it on second call', () => {
    const vuex = createVuex()

    const counterStore = defineStore('counter', () => {
      return { count: 1 }
    })

    vuex.store(counterStore)

    const counter1 = vuex.store(counterStore)

    expect(counter1.count).toBe(1)
  })
})
