import { defineStore } from '../../src'

export default defineStore({
  name: 'counter-option',

  state: () => ({
    count: 2
  }),

  getters: {
    double(): number {
      return this.state.count * 2
    }
  },

  actions: {
    increment(): void {
      this.state.count++
    }
  }
})
