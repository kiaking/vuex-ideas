import {
  createVuex,
  defineStore,
  Definitions,
  OptionDefinition,
  State,
  Getters,
  Actions
} from 'src/index'

describe('unit/marshal-serialize-store-option', () => {
  it('can serialize states', () => {
    const Store = defineStore({
      name: 'store',
      state: () => ({ str: 'a', num: 1, bool: false, n: null })
    })

    const expected = {
      store: { str: 'a', num: 1, bool: false, n: null }
    }

    check(Store, expected)
  })
})

function check<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(definition: OptionDefinition<S, G, A, D>, expected: State) {
  const vuex = createVuex()

  vuex.raw(definition)

  const serializedState = vuex.serialize()

  expect(serializedState).toEqual(expected)
}
