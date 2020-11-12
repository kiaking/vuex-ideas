<template>
  <div class="App">
    <TheSidebar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from '/@vuex/'
import { fetch } from '/@/api/Api'
import Channels from '/@/stores/Channels'
import TheSidebar from '/@/components/TheSidebar.vue'

export default defineComponent({
  name: 'App',

  components: {
    TheSidebar
  },

  setup() {
    const channels = useStore(Channels)

    channels.fresh(fetch('channels'))
  }
})
</script>

<style scoped>
.App {
  min-width: 1056px;
  min-height: 100vh;
}
</style>
