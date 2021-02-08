import { inject } from 'vue'
import { Vuex, key } from './vuex'

export function useVuex(): Vuex {
  return inject(key)!
}
