import { defineStore } from '../../src'

export default defineStore({
  name: 'counter-option',

  state: () => ({
    count: 1,
    option: {
      value: 100
    }
  }),

  getters: {
    double(): number {
      return this.count * 2
    }
  },

  actions: {
    increment(): void {
      this.count = this.count + this.double
    }
  }
})
