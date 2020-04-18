import { Vuex } from '../vuex'
import { Definition } from '../store'

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    stores?: Record<string, Definition>
  }

  interface ComponentCustomProperties {
    $vuex: Vuex
  }
}
