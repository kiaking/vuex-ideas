import { ref } from 'vue'
import { defineStore } from '/@vuex/'

export default defineStore('app', () => {
  const activeChannel = ref(1)

  function setActiveChannel(channel: number): void {
    activeChannel.value = channel
  }

  function isActiveChannel(channel: number): boolean {
    return channel === activeChannel.value
  }

  return {
    activeChannel,
    setActiveChannel,
    isActiveChannel
  }
})
