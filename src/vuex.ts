import { App, InjectionKey, inject } from 'vue'
import { Container, createContainer } from './container'
import {
  CompositionStore,
  UnwrappedCompositionStore,
  OptionStore,
  UnwrappedOptionStore,
  StoreCompositionDefinition,
  StoreOptionDefinition,
  State,
  Getters,
  Actions,
  createAndBindStore,
  createRawStore,
  createUnwrappedStore
} from './store'

export interface Vuex {
  install(app: App, vuex: Vuex): void
  container: Container
  store<T>(
    definition: StoreCompositionDefinition<T>
  ): UnwrappedCompositionStore<T>
  store<S extends State, G extends Getters, A extends Actions>(
    definition: StoreOptionDefinition<S, G, A>
  ): UnwrappedOptionStore<S, G, A>
  raw<T>(definition: StoreCompositionDefinition<T>): CompositionStore<T>
  raw<S extends State, G extends Getters, A extends Actions>(
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
  ): UnwrappedCompositionStore<T>

  function store<S extends State, G extends Getters, A extends Actions>(
    definition: StoreOptionDefinition<S, G, A>
  ): UnwrappedOptionStore<S, G, A>

  function store(definition: any): any {
    return getUnwrappedStore(vuex, definition)
  }

  function raw<T>(
    definition: StoreCompositionDefinition<T>
  ): CompositionStore<T>

  function raw<S extends State, G extends Getters, A extends Actions>(
    definition: StoreOptionDefinition<S, G, A>
  ): OptionStore<S, G, A>

  function raw(definition: any): any {
    return getRawStore(vuex, definition)
  }

  const vuex = {
    install,
    container,
    store,
    raw
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
  return useVuex().raw(definition)
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

  // If the store is already registered, just return it.
  const existingStore = vuex.container.get(name)

  if (existingStore) {
    return existingStore
  }

  // Or else, we'll proceed to store creation. At first, we'll register an
  // empty store to the container, then update the store afterward. this
  // is for cross-store composition.
  const store = vuex.container.reserve(name)

  createAndBindStore(vuex, store, setup)

  return store
}

function getRawStore<T>(
  vuex: Vuex,
  definition: StoreCompositionDefinition<T>
): CompositionStore<T>

function getRawStore<S extends State, G extends Getters, A extends Actions>(
  vuex: Vuex,
  definition: StoreOptionDefinition<S, G, A>
): OptionStore<S, G, A>

function getRawStore(vuex: Vuex, definition: any): any {
  return createRawStore(getStore(vuex, definition))
}

function getUnwrappedStore<T>(
  vuex: Vuex,
  definition: StoreCompositionDefinition<T>
): UnwrappedCompositionStore<T>

function getUnwrappedStore<
  S extends State,
  G extends Getters,
  A extends Actions
>(
  vuex: Vuex,
  definition: StoreOptionDefinition<S, G, A>
): UnwrappedOptionStore<S, G, A>

function getUnwrappedStore(vuex: Vuex, definition: any): any {
  return createUnwrappedStore(getStore(vuex, definition))
}
