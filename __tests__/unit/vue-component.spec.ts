import { mount } from 'test/helpers'
import { ref, defineComponent } from 'vue'
import {
  createVuex,
  defineStore,
  useVuex,
  useStore,
  mapStores
} from 'src/index'

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

    const compositionStore = defineStore('compositionStore', () => {
      return { state: ref(1) }
    })

    const optionStore = defineStore({
      name: 'optionStore',
      state: () => ({
        state: 2
      })
    })

    mount(
      vuex,
      defineComponent({
        setup() {
          const cs = useStore(compositionStore)
          const os = useStore(optionStore)

          expect(cs.state.value).toBe(1)
          expect(os.state).toBe(2)
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

  it('can retrieve stores by `mapStores` helper', () => {
    const vuex = createVuex()

    const compositionStore = defineStore('compositionStore', () => {
      return { state: ref(1) }
    })

    const optionStore = defineStore({
      name: 'optionStore',
      state: () => ({
        state: 2
      })
    })

    mount(
      vuex,
      defineComponent({
        computed: {
          ...mapStores({
            compositionStore,
            optionStore
          })
        },

        created() {
          expect(this.compositionStore.state).toBe(1)
          expect(this.optionStore.state).toBe(2)
        }
      })
    )
  })
})
