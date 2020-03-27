import { defineStore } from '../../src'

export default defineStore({
  name: 'greeter',

  state: () => ({
    greet: 'hello'
  }),

  getters: {
    something (): number {
      return 1
    }
  },

  actions: {
    hi(): string {
      return 'Yo yo!'
    }
  }
})
