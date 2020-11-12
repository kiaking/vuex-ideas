<template>
  <a class="TheSidebarChannel" :class="{ active }" href="#">
    <span class="hash">#</span>{{ channel.name }}
  </a>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { Channel } from '/@/models'

export default defineComponent({
  props: {
    channel: { type: Object as PropType<Channel>, required: true },
    active: { type: Boolean, required: true }
  }
})
</script>

<style scoped>
.TheSidebarChannel {
  display: block;
  padding: 0 24px;
  line-height: 28px;
  font-size: 14px;
  color: var(--c-text-2-inverse);
  transition: background-color .1s;
}

.TheSidebarChannel:hover {
  background-color: var(--c-bg-deep-inverse);
}

.TheSidebarChannel.active {
  color: var(--c-text-1-inverse);
  background-color: var(--c-brand);
  transition: color .25s, background-color .25s;
}

.hash {
  display: inline-block;
  margin-right: 12px;
}
</style>
