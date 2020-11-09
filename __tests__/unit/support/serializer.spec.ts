import { ref, computed } from 'vue'
// import { createVuex, defineStore } from 'src/index'
import { serialize } from 'src/support/serializer'

describe('unit/support/serializer', () => {
  it('can serialize static primitive values', () => {
    const state = {
      string: 'abc',
      number: 1,
      boolean: true,
      null: null
    }

    const expected = {
      string: { isRef: false, value: 'abc' },
      number: { isRef: false, value: 1 },
      boolean: { isRef: false, value: true },
      null: { isRef: false, value: null }
    }

    expect(serialize(state)).toEqual(expected)
  })

  it('can serialize function value', () => {
    const state = {
      value: () => {}
    }

    const expected = {}

    expect(serialize(state)).toEqual(expected)
  })

  it('can serialize ref value', () => {
    const state = {
      value: ref(1)
    }

    const expected = {
      value: { isRef: true, value: 1 }
    }

    expect(serialize(state)).toEqual(expected)
  })

  it('can serialize computed value', () => {
    const count = ref(1)

    const state = {
      value: computed(() => count.value * 2)
    }

    const expected = {}

    expect(serialize(state)).toEqual(expected)
  })
})
