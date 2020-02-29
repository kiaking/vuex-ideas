import { App, InjectionKey, inject } from 'vue'
import { Container, createContainer } from './container'
import { Store, StoreDefinition, createAndBindStore } from './store'

export interface Vuex {
  install(app: App, vuex: Vuex): void
  container: Container
  store<T>(definition: StoreDefinition<T>): Store<T>
}

export const vuexKey = ('vuex' as unknown) as InjectionKey<Vuex>

export function createVuex(): Vuex {
  const container = createContainer()

  function install(app: App): void {
    app.provide(vuexKey, vuex)
  }

  function store<T>(definition: StoreDefinition<T>): Store<T> {
    return getStore(vuex, definition)
  }

  const vuex = {
    install,
    container,
    store
  }

  return vuex
}

export function useVuex(): Vuex {
  return inject(vuexKey)!
}

export function useStore<T>(definition: StoreDefinition<T>): Store<T> {
  return useVuex().store(definition)
}

/**
 * Get a registered store from the container by the given store definition.
 * If the store doesn't exist in the container yet, it will first create a
 * store, then, register it to the container so that it can be fetched back
 * on the next call.
 */
function getStore<T>(vuex: Vuex, definition: StoreDefinition<T>): Store<T> {
  const { name, setup } = definition

  // if the store is already registered, just return it
  const existingStore = vuex.container.get(name) as Store<T> | null

  if (existingStore) {
    return existingStore
  }

  // or else, we'll proceed to store creation. At first, we'll register an
  // empty store to the container, then update the store afterward. this
  // is for cross-store composition.
  const store = vuex.container.reserve<T>(name)

  createAndBindStore(vuex, store, setup)

  return store
}
