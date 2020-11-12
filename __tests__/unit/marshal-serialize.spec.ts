import { reactive, ref, computed } from 'vue'
import { State, serialize } from 'src/marshal'

describe('unit/marshal-serialize', () => {
  test('primitives', () => {
    check(
      { str: 'a', num: 1, bool: false, n: null },
      { str: 'a', num: 1, bool: false, n: null }
    )
  })

  test('array', () => {
    check({ value: [1, 2, 3] }, { value: [1, 2, 3] })
  })

  test('object', () => {
    check({ value: { a: 'a', b: 'b' } }, { value: { a: 'a', b: 'b' } })
  })

  test('function', () => {
    check({ value: 1, func: () => {} }, { value: 1 })
  })

  test('reactive', () => {
    const state = reactive({ value: 1 })

    check(state, { value: 1 })
  })

  test('ref primitives', () => {
    check(
      { str: ref('a'), num: ref(1), bool: ref(false), n: ref(null) },
      { str: 'a', num: 1, bool: false, n: null }
    )
  })

  test('ref array', () => {
    check({ value: ref([1, 2, 3]) }, { value: [1, 2, 3] })
  })

  test('ref in reactive', () => {
    const count = ref(1)
    const state = reactive({ count })

    check(state, { count: 1 })
  })

  test('computed', () => {
    const count = ref(1)
    const double = computed(() => count.value * 2)

    check({ count, double }, { count: 1 })
  })

  test('computed in reactive', () => {
    const count = ref(1)
    const double = computed(() => count.value * 2)
    const state = reactive({ count, double })

    check(state, { count: 1 })
  })
})

function check(state: State, expected: State): void {
  expect(serialize(state)).toEqual(expected)
}
