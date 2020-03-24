import { defineStore } from '../../src'

export default defineStore({
  name: 'counter-option',

  state: () => ({
    count: 1
  }),

  getters: {
    double(): number {
      return this.state.count * 2
    }
  },

  actions: {
    increment(): void {
      console.log(this.double)
      this.state.count++
    }
  }
})
