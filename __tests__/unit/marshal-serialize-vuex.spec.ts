import { createVuex } from 'src/index'

describe('unit/marshal-serialize-vuex', () => {
  it('can serialize an empty registries', () => {
    expect(createVuex().serialize()).toEqual({})
  })

  it('can serialize a registry with only initial state being set', () => {
    const vuex = createVuex()

    vuex.replaceState('store', { value: 1 })

    expect(vuex.serialize()).toEqual({})
  })
})
