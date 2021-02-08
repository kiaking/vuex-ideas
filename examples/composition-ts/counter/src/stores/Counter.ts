import { ref, computed } from 'vue'
import { defineStore } from '/@vuex/'

const useGreeter = defineStore({
  key: 'greeter',

  state: () => ({
    greet: 'Hello'
  }),

  getters: {
    word(): string {
      return this.greet
    }
  }
})

export const useCounter = defineStore('counter', () => {
  const count = ref(1)

  // const double = computed(() => count.value * 2)

  // function increment() {
  //   count.value++
  // }

  // function decrement() {
  //   count.value--
  // }

  return {
    count
    // double,
    // increment,
    // decrement
  }
})

export const useOptionCounter = defineStore({
  key: 'ocounter',

  use: () => ({
    greeter: useGreeter
  }),

  state: () => ({
    count: 1
  }),

  getters: {
    double(): number {
      this.greeter.greet
      this.greeter.word
      return this.count * 2
    }
  },

  actions: {
    increment(): void {
      this.count++
    }
  }
})
