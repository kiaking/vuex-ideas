import { inject, InjectionKey } from 'vue'
import { Vuex } from './vuex'

export const vuexKey = ('vuex' as unknown) as InjectionKey<Vuex>

export function useVuex(): Vuex {
  return inject(vuexKey)!
}
