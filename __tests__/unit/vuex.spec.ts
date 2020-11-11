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

  it('can replace all states at once', () => {
    const vuex = createVuex()

    vuex.replaceAllStates({
      storeA: { valueA: 1 },
      storeB: { valueB: 2 }
    })

    expect(vuex.registries.storeA.initialState).toEqual({ valueA: 1 })
    expect(vuex.registries.storeB.initialState).toEqual({ valueB: 2 })
  })

  it('can serialize an empty registries', () => {
    expect(createVuex().serialize()).toEqual({})
  })

  it('can serialize a registry with only initial state being set', () => {
    const vuex = createVuex()

    vuex.replaceState('store', { value: 1 })

    expect(vuex.serialize()).toEqual({})
  })
})
