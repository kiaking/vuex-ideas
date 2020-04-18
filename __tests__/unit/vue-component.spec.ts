import { mount } from 'test/helpers'
import { ref, defineComponent } from 'vue'
import { createVuex, defineStore, useVuex, useStore } from 'src/index'

describe('unit/vue-component', () => {
  it('can retrieve the vuex instance in setup hook', () => {
    const vuex = createVuex()

    mount(
      vuex,
      defineComponent({
        setup() {
          expect(useVuex()).toBe(vuex)
        }
      })
    )
  })

  it('can retrieve a store in setup hook', () => {
    const vuex = createVuex()

    const store = defineStore('store', () => {
      return { state: ref(true) }
    })

    mount(
      vuex,
      defineComponent({
        setup() {
          expect(useStore(store).state.value).toBe(true)
        }
      })
    )
  })

  it('can retrieve the vuex instance from custom property', () => {
    const vuex = createVuex()

    mount(
      vuex,
      defineComponent({
        created() {
          expect(this.$vuex).toBe(vuex)
        }
      })
    )
  })

  it('can retrieve stores by custom options', () => {
    const vuex = createVuex()

    const store = defineStore({
      name: 'store',
      state: () => ({ value: 1 })
    })

    mount(
      vuex,
      defineComponent({
        stores: {
          store
        },

        created() {
          // TODO: Type this one.
          expect((this as any).store.value).toBe(1)
        }
      })
    )
  })
})
