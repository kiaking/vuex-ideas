<template>
  <div class="APP">
    <p class="count">Count: {{ counter.count }}</p>
    <p class="double">Double: {{ counter.double }}</p>
    <button class="increment" @click="counter.increment">INCREMENT</button>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import counter from './stores/counter'

export default {
  stores: {
    counter
  }
}
</script>
