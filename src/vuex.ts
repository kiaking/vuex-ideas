import { App, InjectionKey, inject } from 'vue'
import { isFunction } from './utils'
import { Container, createContainer } from './container'
import {
  CompositionStore,
  ReactiveCompositionStore,
  OptionStore,
  CompositionDefinition,
  OptionDefinition,
  State,
  Getters,
  Actions,
  createAndBindStore,
  createReactiveStore
} from './store'

export interface Vuex {
  install(app: App, vuex: Vuex): void
  container: Container
  raw<T>(definition: CompositionDefinition<T>): CompositionStore<T>
  raw<S extends State, G extends Getters, A extends Actions>(
    definition: OptionDefinition<S, G, A>
  ): OptionStore<S, G, A>
  store<T>(definition: CompositionDefinition<T>): ReactiveCompositionStore<T>
  store<S extends State, G extends Getters, A extends Actions>(
    definition: OptionDefinition<S, G, A>
  ): OptionStore<S, G, A>
}

export const vuexKey = ('vuex' as unknown) as InjectionKey<Vuex>

export function createVuex(): Vuex {
  const container = createContainer()

  function install(app: App): void {
    app.provide(vuexKey, vuex)
  }

  /**
   * Get a registered raw store from the container by the given store
   * definition. If the store doesn't exist in the container yet, it will first
   * create a store, then, register it to the container so that it can be
   * fetched back on the next call.
   */
  function raw<T>(definition: CompositionDefinition<T>): CompositionStore<T>

  function raw<S extends State, G extends Getters, A extends Actions>(
    definition: OptionDefinition<S, G, A>
  ): OptionStore<S, G, A>

  function raw(definition: any): any {
    const { name, setup } = definition

    // If the store is already registered, just return it.
    const existingStore = container.get(name)

    if (existingStore) {
      return existingStore
    }

    // Or else, we'll proceed to store creation. At first, we'll register an
    // empty store to the container, then update the store afterward. this
    // is for cross-store composition.
    const newStore = isFunction(setup)
      ? container.reservePlain(name)
      : container.reserveReactive(name)

    createAndBindStore(vuex, newStore, setup)

    return newStore
  }

  /**
   * Get a reactive version of the store, which provides users direct access to
   * `ref` and `computed` in the composition store. It's particularly useful
   * when consuming composition store inside option syntax Vue Component.
   */
  function store<T>(
    definition: CompositionDefinition<T>
  ): ReactiveCompositionStore<T>

  function store<S extends State, G extends Getters, A extends Actions>(
    definition: OptionDefinition<S, G, A>
  ): OptionStore<S, G, A>

  function store(definition: any): any {
    return createReactiveStore(raw(definition))
  }

  const vuex = {
    install,
    container,
    raw,
    store
  }

  return vuex
}

export function useVuex(): Vuex {
  return inject(vuexKey)!
}

export function useStore<T>(
  definition: CompositionDefinition<T>
): CompositionStore<T>

export function useStore<S extends State, G extends Getters, A extends Actions>(
  definition: OptionDefinition<S, G, A>
): OptionStore<S, G, A>

export function useStore(definition: any): any {
  return useVuex().raw(definition)
}
