<template>
  <div class="APP">
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.double }}</p>
    <button @click="counter.increment">INCREMENT</button>
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
