import { mount } from 'test/helpers'
import { ref } from 'vue'
import { createVuex, defineStore, useVuex, useStore } from 'src/index'

describe('unit/vue-component', () => {
  it('can retrieve the vuex instance in setup hook', () => {
    const vuex = createVuex()

    mount(vuex, {
      setup() {
        const vx = useVuex()

        expect(vx).toBe(vuex)
      }
    })
  })

  it('can retrieve a store in setup hook', () => {
    const vuex = createVuex()

    const store = defineStore('store', () => {
      return { state: ref(true) }
    })

    mount(vuex, {
      setup() {
        const s = useStore(store)

        expect(s.state.value).toBe(true)
      }
    })
  })
})
