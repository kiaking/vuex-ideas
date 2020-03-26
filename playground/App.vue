<template>
  <div class="APP">
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <!-- <p>Full Name: {{ fullName }}</p> -->
    <!-- <p>Count with Greet: {{ countWithGreet }}</p> -->
    <button @click="increment">INCREMENT</button>
    <!-- <button @click="incrementDouble">INCREMENT DOUBLE</button> -->

    <!-- <hr> -->

    <!-- <p>Greet: {{ greet }}</p> -->
    <!-- <button @click="changeGreet">CHANGE GREET MESSAGE</button> -->
  </div>
</template>

<script>
import { toRefs } from 'vue'
import { useStore } from '../src'
import counterStore from './stores/counter'
import counterOStore from './stores/counter-option'
import greeterStore from './stores/greeter'

export default {
  setup() {
    // const counter = useStore(counterStore)
    const counter = useStore(counterOStore)
    const greeter = useStore(greeterStore)

    const { count, double } = toRefs(counter)

    return {
      count,
      double,
    //   counterState: counter.state,
    //   double: computed(() => counter.double()),
    //   fullName: computed(() => counter.fullName()),
    //   countWithGreet: computed(() => counter.countWithGreet()),
      increment: counter.increment,
    //   incrementDouble: counter.incrementDouble,

      // greet: greeter.greet,
    //   changeGreet: greeter.changeGreet
    }
  }
}
</script>
