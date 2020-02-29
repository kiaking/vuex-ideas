import { App, reactive, computed, inject } from 'vue'
import {
  State,
  Getter,
  StoreWithGetters,
  Action,
  StoreWithActions
} from './module'

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

    module(definition: any) {
      const { name, state, actions, getters, use } = definition
      return buildModule(this, name, state, actions, getters, use)
    }
  }
}

export function useStore(): Store {
  return inject('store') as Store
}

function buildModule<
  S extends State,
  G extends Record<string, Getter>,
  A extends Record<string, Action>
>(
  s: any,
  name: string,
  initialState = () => ({} as S),
  getters: G = {} as G,
  actions: A = {} as A,
  modules: any = {}
) {
  if (s.container[name]) {
    return s.container[name]
  }

  s.container[name] = {}

  const state = reactive(initialState())

  const storeWithState = {
    state
  }

  const wrappedGetters: StoreWithGetters<G> = {} as StoreWithGetters<G>
  for (const getterName in getters) {
    wrappedGetters[getterName] = function() {
      const fn = getters[getterName]
      const args = (arguments as unknown) as any[]
      return computed(() => fn.apply(store, args)).value
    } as StoreWithGetters<G>[typeof getterName]
  }

  const wrappedActions = {} as StoreWithActions<A>
  for (const actionName in actions) {
    wrappedActions[actionName] = function() {
      return actions[actionName].apply(store, (arguments as unknown) as any[])
    } as StoreWithActions<A>[typeof actionName]
  }

  const m = modules()
  const storeWithModules = {} as any
  for (const moduleName in m) {
    const { name, state, actions, getters, use } = m[moduleName]
    storeWithModules[moduleName] = buildModule(
      s,
      name,
      state,
      actions,
      getters,
      use
    )
  }

  const store = {
    ...storeWithState,
    ...wrappedGetters,
    ...wrappedActions,
    ...storeWithModules
  }

  s.container[name] = store

  return store
}
