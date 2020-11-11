import { ref } from 'vue'
import { createVuex, defineStore } from 'src/index'

describe('unit/marshal-hydrate-store-composition', () => {
  it('can hydrate primitive ref states', () => {
    const vuex = createVuex()

    const Store = defineStore('store', () => {
      const str = ref('a')
      const num = ref(1)
      const bool = ref(false)
      const n = ref<string | null>('not null')

      return { str, num, bool, n }
    })

    vuex.replaceState('store', {
      str: 'b',
      num: 2,
      bool: true,
      n: null
    })

    const store = vuex.raw(Store)

    expect(store.str.value).toBe('b')
    expect(store.num.value).toBe(2)
    expect(store.bool.value).toBe(true)
    expect(store.n.value).toBe(null)
  })
})
