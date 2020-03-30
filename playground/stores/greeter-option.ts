import { defineStore } from '../../src'
import counter from './counter-option'
import other from './other'

export default defineStore({
  name: 'greeter',

  use: (): any => ({
    counter,
    other
  }),

  state: () => ({
    greet: 'hello'
  }),

  getters: {
    something(): number {
      return 1
    }
  },

  actions: {
    hi(): string {
      return 'Yo yo!'
    }
  }
})
