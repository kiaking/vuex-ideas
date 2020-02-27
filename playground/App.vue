<template>
  <div class="APP">
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">INCREMENT</button>

    <p>Greet: {{ greet }}</p>
  </div>
</template>

<script>
import counter from './store/counter'
import greeter from './store/greeter'

export default {
  setup() {
    const { count, double, increment } = counter
    const { greet } = greeter

    return {
      count,
      double,
      increment,
      greet
    }
  }
}
</script>
