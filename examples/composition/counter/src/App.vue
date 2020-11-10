<template>
  <div class="container">
    <div class="states">
      <p class="state">Count: {{ counter.count.value }}</p>
      <p class="state">Double: {{ counter.double.value }}</p>
    </div>
    <div class="actions">
      <button class="action" @click="counter.increment">INCREMENT</button>
      <button class="action" @click="counter.decrement">DECREMENT</button>
    </div>
  </div>
</template>

<script>
import { useStore } from '/@vuex/'
import Counter from './stores/Counter'

export default {
  name: 'Counter',

  setup() {
    const counter = useStore(Counter)

    return {
      counter
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  padding: 128px 48px;
  max-width: 512px;
}

.states {
  display: flex;
  justify-content: center;
}

.state {
  text-align: center;
  width: 128px;
  font-size: 20px;
}

.actions {
  display: flex;
  justify-content: center;
  padding-top: 32px;
}

.action {
  letter-spacing: 1px;
  border-radius: 4px;
  padding: 8px 16px;
  width: 128px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #3eaf7c;
  transition: background-color .25s;
}

.action:hover {
  background-color: #338e65;
}

.action:active {
  background-color: #2b7855;
  transition: background-color .1s;
}

.action + .action {
  margin-left: 16px;
}
</style>
