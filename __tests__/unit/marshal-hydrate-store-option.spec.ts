import { createVuex, defineStore } from 'src/index'

describe('unit/marshal-hydrate-store-option', () => {
  it('can hydrate primitive states', () => {
    const vuex = createVuex()

    const Store = defineStore({
      name: 'store',
      state: () => ({
        str: 'a',
        num: 1,
        bool: false,
        n: 'not null'
      })
    })

    vuex.replaceState('store', {
      str: 'b',
      num: 2,
      bool: true,
      n: null
    })

    const store = vuex.store(Store)

    expect(store.str).toBe('b')
    expect(store.num).toBe(2)
    expect(store.bool).toBe(true)
    expect(store.n).toBe(null)
  })
})
