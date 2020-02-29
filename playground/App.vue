<template>
  <div class="APP">
    <!-- <p>Count: {{ count }}</p> -->
    <!-- <p>Double: {{ double }}</p> -->
    <!-- <p>Full Name: {{ fullName }}</p> -->
    <!-- <p>Count with Greet: {{ countWithGreet }}</p> -->
    <!-- <button @click="increment">INCREMENT</button> -->
    <!-- <button @click="incrementDouble">INCREMENT DOUBLE</button> -->

    <!-- <hr> -->

    <!-- <p>Greet: {{ greet }}</p> -->
    <!-- <button @click="changeGreet">CHANGE GREET MESSAGE</button> -->
  </div>
</template>

<script>
// import { computed } from 'vue'
// import { useVuex } from '../src'
// import counterStore from './stores/counter'
// import greeterStore from './stores/greeter'

export default {
  setup() {
    // const vuex = useVuex()
    // const counter = vuex.store(counterStore)
    // const greeter = vuex.store(greeterStore)

    return {
      // count: counter.count,
      // double: counter.double,
    //   counterState: counter.state,
    //   double: computed(() => counter.double()),
    //   fullName: computed(() => counter.fullName()),
    //   countWithGreet: computed(() => counter.countWithGreet()),
      // increment: counter.increment,
    //   incrementDouble: counter.incrementDouble,

      // greet: greeter.greet,
    //   changeGreet: greeter.changeGreet
    }
  }
}
</script>
