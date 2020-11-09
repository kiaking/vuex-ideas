import { ref, reactive, computed } from 'vue'
import { createVuex, defineStore } from 'src/index'

describe('unit/revive', () => {
  it('can serialize the given store state tree', () => {
    const vuex = createVuex()

    const Counter = defineStore('counter', () => {
      const valueStatic = 1

      const valueRef = ref(1)

      const valueReactive = reactive({
        valueA: 'a',
        valueB: 'b',
        nested: {
          nestedC: 'c',
          nestedD: 'd'
        }
      })

      const valueCompued = computed(() => valueRef.value * 2)

      const valueFunction = () => {}

      return {
        valueStatic,
        valueRef,
        valueReactive,
        valueCompued,
        valueFunction
      }
    })

    const state = vuex.raw(Counter).$serialize()

    const expected = {
      valueStatic: {
        isRef: false,
        value: 1
      },
      valueRef: {
        isRef: true,
        value: 1
      },
      valueReactive: {
        isRef: false,
        value: {
          valueA: { isRef: false, value: 'a' },
          valueB: { isRef: false, value: 'b' },
          nested: {
            isRef: false,
            value: {
              nestedC: { isRef: false, value: 'c' },
              nestedD: { isRef: false, value: 'd' }
            }
          }
        }
      }
    }

    expect(state).toEqual(expected)
  })

  it('can serialize the given store state tree', () => {
    const vuex = createVuex()

    const Counter = defineStore('counter', () => {
      const valueRef = ref(1)

      return { valueRef }
    })

    const state = {
      valueRef: { isRef: true, value: 2 }
    }

    const counter = vuex.raw(Counter)

    counter.$revive(state)

    expect(counter.valueRef.value).toEqual(2)
  })
})
