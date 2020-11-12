import { ref } from 'vue'
import { createVuex, defineStore, State } from 'src/index'

type Pattern = [State, State]
describe('unit/marshal-serialize-store-composition', () => {
  it('can serialize states', () => {
    const patterns: Pattern[] = [
      [
        { str: 'a', num: 1, bool: false, n: null },
        { str: 'a', num: 1, bool: false, n: null }
      ],
      [
        { str: ref('a'), num: ref(1), bool: ref(false), n: ref(null) },
        { str: 'a', num: 1, bool: false, n: null }
      ],
      [{ value: 1, func: () => {} }, { value: 1 }]
    ]

    patterns.forEach(check)
  })
})

function check(pattern: Pattern) {
  const vuex = createVuex()

  const Store = defineStore('store', () => pattern[0])

  vuex.raw(Store)

  const serializedState = vuex.serialize()

  const expected = { store: pattern[1] }

  expect(serializedState).toEqual(expected)
}
