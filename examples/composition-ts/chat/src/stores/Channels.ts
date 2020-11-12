import { ref } from 'vue'
import { defineStore } from '/@vuex/'
import type { Channel } from '/@/models'

export default defineStore('channels', () => {
  const data = ref<Channel[]>([])

  function fresh(channels: Channel[]): void {
    data.value = channels
  }

  return {
    data,
    fresh
  }
})
