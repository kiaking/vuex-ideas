<template>
  <div class="APP">
    <p class="count">Count: {{ counter.count }}</p>
    <p class="double">Double: {{ counter.double }}</p>
    <button class="increment" @click="counter.increment">INCREMENT</button>
  </div>
</template>

<script>
import { mapStores } from 'vuex'
import counter from './stores/counter'

export default {
  computed: mapStores({ counter })
}
</script>
