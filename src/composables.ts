import { inject } from 'vue'
import { Vuex, vuexKey } from './vuex'
import {
  Definitions,
  OptionDefinition,
  CompositionStore,
  CompositionDefinition,
  OptionStore,
  State,
  Getters,
  Actions
} from './store'

export function useVuex(): Vuex {
  return inject(vuexKey)!
}

export function useStore<T>(
  definition: CompositionDefinition<T>
): CompositionStore<T>

export function useStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(definition: OptionDefinition<S, G, A, D>): OptionStore<S, G, A, D>

export function useStore(definition: any): any {
  return useVuex().raw(definition)
}
