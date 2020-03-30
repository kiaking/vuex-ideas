import { defineStore } from '../../src'

export default defineStore({
  name: 'other',

  state: () => ({
    yoyoyo: 'hello'
  }),

  actions: {
    yayaya(): string {
      return 'Yo yo!'
    }
  }
})
