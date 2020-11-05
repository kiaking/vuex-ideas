import { Vuex } from '../vuex'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $vuex: Vuex
  }
}
