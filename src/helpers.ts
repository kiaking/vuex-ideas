import { ComponentPublicInstance } from 'vue'
import {
  OptionStore,
  Definitions,
  CompositionDefinition,
  ReactiveCompositionStore,
  OptionDefinition
} from './store'

export type MappedStores<D extends Definitions> = {
  [K in keyof D]: D[K] extends CompositionDefinition<any>
    ? () => ReactiveCompositionStore<ReturnType<D[K]['setup']>>
    : D[K] extends OptionDefinition<infer S, infer G, infer A, infer M>
    ? () => OptionStore<S, G, A, M>
    : never
}

export function mapStores<D extends Definitions>(
  definitions: D
): MappedStores<D> {
  const stores = {} as MappedStores<D>

  for (const name in definitions) {
    ;(stores as any)[name] = function (this: ComponentPublicInstance) {
      return this.$vuex.store(definitions[name])
    }
  }

  return stores
}
