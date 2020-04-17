import { ref, computed } from 'vue'
import { defineStore } from 'vuex'

export default defineStore({
  name: 'counter',

  state: () => ({
    count: 1
  }),

  getters: {
    double() {
      return this.count * 2
    }
  },

  actions: {
    increment() {
      this.count++
    }
  }
})
