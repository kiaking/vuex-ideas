import { defineStore } from '../../src'
import greeter from './greeter'
import greeterO from './greeter-option'

export default defineStore({
  name: 'counter-option',

  use: () => ({
    greeter,
    greeterO
  }),

  state: () => ({
    count: 1
  }),

  getters: {
    double(): number {
      return this.count * 2
    }
  },

  actions: {
    increment(): void {
      this.greeter
      this.greeterO.
      this.count = this.count + this.double
    }
  }
})
