import { App, InjectionKey, inject } from 'vue'
import { Container, createContainer } from './container'
import {
  CompositionStore,
  OptionStore,
  StoreCompositionDefinition,
  StoreOptionDefinition,
  State,
  Getters,
  Actions,
  createAndBindStore,
} from './store'

export interface Vuex {
  install(app: App, vuex: Vuex): void
  container: Container
  store<T>(definition: StoreCompositionDefinition<T>): CompositionStore<T>
  store<S extends State, G extends Getters, A extends Actions>(
    definition: StoreOptionDefinition<S, G, A>
  ): OptionStore<S, G, A>
}

export const vuexKey = ('vuex' as unknown) as InjectionKey<Vuex>

export function createVuex(): Vuex {
  const container = createContainer()

  function install(app: App): void {
    app.provide(vuexKey, vuex)
  }

  function store<T>(
    definition: StoreCompositionDefinition<T>
  ): CompositionStore<T>

  function store<S extends State, G extends Getters, A extends Actions>(
    definition: StoreOptionDefinition<S, G, A>
  ): OptionStore<S, G, A>

  function store(definition: any): any {
    return getStore(vuex, definition)
  }

  const vuex = {
    install,
    container,
    store,
  }

  return vuex
}

export function useVuex(): Vuex {
  return inject(vuexKey)!
}

export function useStore<T>(
  definition: StoreCompositionDefinition<T>
): CompositionStore<T>

export function useStore<S extends State, G extends Getters, A extends Actions>(
  definition: StoreOptionDefinition<S, G, A>
): OptionStore<S, G, A>

export function useStore(definition: any): any {
  return useVuex().store(definition)
}

/**
 * Get a registered store from the container by the given store definition.
 * If the store doesn't exist in the container yet, it will first create a
 * store, then, register it to the container so that it can be fetched back
 * on the next call.
 */
function getStore<T>(
  vuex: Vuex,
  definition: StoreCompositionDefinition<T>
): CompositionStore<T>

function getStore<S extends State, G extends Getters, A extends Actions>(
  vuex: Vuex,
  definition: StoreOptionDefinition<S, G, A>
): OptionStore<S, G, A>

function getStore(vuex: Vuex, definition: any): any {
  const { name, setup } = definition

  // if the store is already registered, just return it
  const existingStore = vuex.container.get(name)

  if (existingStore) {
    return existingStore
  }

  // or else, we'll proceed to store creation. At first, we'll register an
  // empty store to the container, then update the store afterward. this
  // is for cross-store composition.
  const store = vuex.container.reserve(name)

  createAndBindStore(vuex, store, setup)

  return store
}
