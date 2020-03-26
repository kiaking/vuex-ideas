import { createContainer } from 'src/container'

describe('unit/container', () => {
  it('registeres the store', () => {
    const container = createContainer()

    const store = {}

    container.register('test', store)

    expect(container.stores.test).toBe(store)
  })

  it('gets the store', () => {
    const container = createContainer()

    const store = {}

    container.register('test', store)

    expect(container.get('test')).toBe(store)
  })

  it('returns null when store is not found', () => {
    const container = createContainer()

    expect(container.get('test')).toBe(null)
  })

  it('reserves the store name, and return empty store', () => {
    const container = createContainer()

    const store = container.reservePlain('test')

    expect(container.get('test')).toBe(store)
  })
})
