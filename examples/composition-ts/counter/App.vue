<template>
  <div class="APP">
    <p class="count">Count: {{ count }}</p>
    <p class="double">Double: {{ double }}</p>
    <button class="increment" @click="increment">INCREMENT</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import counterStore from './stores/counter'

export default defineComponent({
  setup() {
    const counter = useStore(counterStore)

    return {
      count: counter.count,
      double: counter.double,
      increment: counter.increment,
    }
  }
})
</script>
