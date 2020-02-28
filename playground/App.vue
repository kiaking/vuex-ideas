<template>
  <div class="APP">
    <p>Count: {{ counterState.count }}</p>
    <p>Double: {{ double }}</p>
    <p>Full Name: {{ fullName }}</p>
    <p>Count with Greet: {{ countWithGreet }}</p>
    <button @click="increment">INCREMENT</button>
    <button @click="incrementDouble">INCREMENT DOUBLE</button>

    <hr>

    <p>Greet: {{ greeterState.greet }}</p>
    <button @click="changeGreet">CHANGE GREET MESSAGE</button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from '../src'
import counterModule from './store/counter'
import greeterModule from './store/greeter'

export default {
  setup() {
    const store = useStore()
    const counter = store.module(counterModule)
    const greeter = store.module(greeterModule)

    return {
      counterState: counter.state,
      double: computed(() => counter.double()),
      fullName: computed(() => counter.fullName()),
      countWithGreet: computed(() => counter.countWithGreet()),
      increment: counter.increment,
      incrementDouble: counter.incrementDouble,

      greeterState: greeter.state,
      changeGreet: greeter.changeGreet
    }
  }
}
</script>
