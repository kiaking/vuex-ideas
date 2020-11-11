import { createVuex, defineStore, State } from 'src/index'

type Pattern = [State, State]

;describe('unit/marshal-serialize-store-option', () => {
  it('can serialize states', () => {
    const patterns: Pattern[] = [
      [
        { str: 'a', num: 1, bool: false, n: null },
        { str: 'a', num: 1, bool: false, n: null }
      ]
    ]

    patterns.forEach(check)
  })
})

function check(pattern: Pattern) {
  const vuex = createVuex()

  const Store = defineStore({
    name: 'store',
    state: () => pattern[0]
  })

  vuex.raw(Store)

  const serializedState = vuex.serialize()

  const expected = { store: pattern[1] }

  expect(serializedState).toEqual(expected)
}
