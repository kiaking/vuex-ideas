import { ComponentPublicInstance } from 'vue'
import { Builds } from './store'

export type MappedStores<B extends Builds> = {
  [K in keyof B]: () => ReturnType<B[K]>
}

export function mapStores<B extends Builds>(builds: B): MappedStores<B> {
  const stores = {} as MappedStores<B>

  for (const name in builds) {
    ;(stores as any)[name] = function (this: ComponentPublicInstance) {
      return this.$vuex.store(builds[name])
    }
  }

  return stores
}
