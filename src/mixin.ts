import { App } from 'vue'
import { Vuex, vuexKey } from './vuex'

export function mixin(app: App, vuex: Vuex): void {
  app.provide(vuexKey, vuex)

  app.config.globalProperties.$vuex = vuex

  app.mixin({
    beforeCreate() {
      const stores = this.$options.stores

      if (!stores) {
        return
      }

      for (const name in stores) {
        const store = stores[name]

        this[name] = vuex.store(store)
      }
    }
  })
}
