<template>
  <div class="APP">
    <p>Count: {{ count }}</p>
    <!-- <p>Double: {{ double }}</p> -->
    <button @click="increment">INCREMENT</button>

    <!-- <p>Greet: {{ greet }}</p> -->
  </div>
</template>

<script>
import { useStore } from '../src'
import counterModule from './store/counter'
// import greeter from './store/greeter'

export default {
  setup() {
    const store = useStore()
    const counter = store.module(counterModule)
    console.log(counter)

    // const { count, double, increment } = counter
    // const { greet } = greeter

    return {
      count: counter.count,
    //   double,
      increment: counter.increment,
    //   greet
    }
  }
}
</script>
