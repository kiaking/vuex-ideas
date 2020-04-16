<template>
  <div class="APP">
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">INCREMENT</button>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import counterStore from './stores/counter'

export default {
  setup() {
    const counter = useStore(counterStore)

    return {
      count: counter.count,
      double: counter.double,
      increment: counter.increment,
    }
  }
}
</script>
