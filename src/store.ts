import { App, reactive, toRefs, inject } from 'vue'
import { State, Action, ModuleDefinition } from './module'

export interface Store {
  container: Container
  install(app: App): void
}

export interface Container {
  [key: string]: any
}

export function createStore() {
  return {
    container: {},

    install(app: App): void {
      app.provide('store', this)
    },

    module<S extends State, A extends Record<string, Action<S>>>(definition: ModuleDefinition<S, A>) {
      const state = reactive(definition.state ? definition.state() : {})

      let actions: any = {}

      if (definition.actions) {
        for (const actionName in definition.actions) {
          const action = definition.actions[actionName]

          actions[actionName] = () => action(state as any)
        }
      }

      return {
        ...toRefs(state),
        ...actions
      }
    }
  }
}

export function useStore(): Store {
  return inject('store') as Store
}
