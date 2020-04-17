import { createVuex, defineStore, Vuex, Provide } from 'src/index'

describe('unit/plugin', () => {
  it('can install plugin to the `context` for the composition store', () => {
    function pluginA(_vuex: Vuex, provide: Provide): void {
      provide('a', 'a')
    }

    function pluginB(_vuex: Vuex, provide: Provide): void {
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
    function pluginA(_vuex: Vuex, provide: Provide): void {
      provide('a', 'a')
    }

    function pluginB(_vuex: Vuex, provide: Provide): void {
      provide('b', (word: string) => `Hello, ${word}`)
    }

    const vuex = createVuex({
      plugins: [pluginA, pluginB]
    })

    const store = defineStore({
      name: 'store',
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
