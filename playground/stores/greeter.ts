import { ref } from 'vue'
import { defineStore } from '../../src'

export default defineStore('greeter', ({ use }) => {
  const greet = ref('Hello')

  return {
    greet
  }
})
