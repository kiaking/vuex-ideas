<template>
  <aside class="TheSidebar">
    <h1 class="header">Vuex Chat</h1>

    <section class="section">
      <h2 class="section-title">Channels</h2>

      <ul class="channel-list">
        <li v-for="item in orderedChannels" :key="item.id" class="channel-item">
          <TheSidebarChannel :channel="item" :active="isActiveChannel(item.id)" />
        </li>
      </ul>
    </section>
  </aside>
</template>

<script lang="ts">
import orderBy from 'lodash-es/orderBy'
import { defineComponent, computed } from 'vue'
import { useStore } from '/@vuex/'
import App from '/@/stores/App'
import Channels from '/@/stores/Channels'
import TheSidebarChannel from './TheSidebarChannel.vue'

export default defineComponent({
  components: {
    TheSidebarChannel
  },

  setup () {
    const app = useStore(App)
    const channels = useStore(Channels)

    const orderedChannels = computed(() => {
      return orderBy(channels.data.value, ['name'])
    })

    function isActiveChannel(channel: string): boolean {
      return app.isActiveChannel(channel)
    }

    return {
      orderedChannels,
      isActiveChannel
    }
  }
})
</script>

<style scoped>
.TheSidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 240px;
  background-color: var(--c-bg-inverse);
}

.header {
  border-bottom: 1px solid var(--c-divider-inverse);
  padding: 16px 24px;
  font-size: 20px;
  font-weight: 400;
  color: var(--c-text-1-inverse);
}

.section-title {
  padding: 16px 24px 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--c-text-2-inverse);
}

.channel-list {
  padding-top: 6px;
}
</style>
