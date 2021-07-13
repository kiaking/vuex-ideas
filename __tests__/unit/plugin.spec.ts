import { createVuex, defineStore, Plugin } from 'src/index'

describe('unit/plugin', () => {
  it('can install plugin to the `context` for the composition store', () => {
    const pluginA: Plugin = ({ provide }) => {
      provide('a', 'a')
    }

    const pluginB: Plugin = ({ provide }) => {
      provide('b', (word: string) => `Hello, ${word}`)
    }

    const vuex = createVuex({
      plugins: [pluginA, pluginB]
    })

    const store = defineStore('store', ({ a, b }: any) => {
      return { a, b }
    })

    const s = vuex.store(store)

    expect(s.a).toBe('a')
    expect(s.b('b')).toBe('Hello, b')
  })

  it('can install plugin to the `this` for the option store', () => {
    const pluginA: Plugin = ({ provide }): void => {
      provide('a', 'a')
    }

    const pluginB: Plugin = ({ provide }): void => {
      provide('b', (word: string) => `Hello, ${word}`)
    }

    const vuex = createVuex({
      plugins: [pluginA, pluginB]
    })

    const store = defineStore({
      key: 'store',
      getters: {
        a(): string {
          return this.$a
        }
      },
      actions: {
        b(word: string): string {
          return this.$b(word)
        }
      }
    })

    const s = vuex.store(store)

    expect(s.a).toBe('a')
    expect(s.b('b')).toBe('Hello, b')
  })
})
