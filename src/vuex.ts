import { App, reactive, isReactive, InjectionKey } from 'vue'
import { isFunction } from './utils'
import {
  Store,
  Definitions,
  CompositionStore,
  ReactiveCompositionStore,
  OptionStore,
  CompositionDefinition,
  OptionDefinition,
  State,
  Getters,
  Actions
} from './store'
import { setupCompositionStore, setupOptionStore } from './setup'
import { Plugin, installPlugins } from './plugin'

export interface Vuex {
  registry: Registry
  plugins: Plugins
  install(app: App, vuex: Vuex): void
  raw<T>(definition: CompositionDefinition<T>): CompositionStore<T>
  raw<
    S extends State,
    G extends Getters,
    A extends Actions,
    D extends Definitions
  >(
    definition: OptionDefinition<S, G, A, D>
  ): OptionStore<S, G, A, D>
  store<T>(definition: CompositionDefinition<T>): ReactiveCompositionStore<T>
  store<
    S extends State,
    G extends Getters,
    A extends Actions,
    D extends Definitions
  >(
    definition: OptionDefinition<S, G, A, D>
  ): OptionStore<S, G, A, D>
}

export interface Options {
  plugins?: Plugin[]
}

export interface Registry {
  [name: string]: Store<any>
}

export type Plugins = Record<string, any>

export const vuexKey = ('vuex' as unknown) as InjectionKey<Vuex>

export function createVuex(options: Options = {}): Vuex {
  const vuex = newVuex()

  options.plugins && installPlugins(vuex, options.plugins)

  return vuex
}

function newVuex(): Vuex {
  const registry: Registry = {}
  const plugins: Plugins = {}

  function install(app: App): void {
    app.provide(vuexKey, vuex)
    app.config.globalProperties.$vuex = vuex
  }

  /**
   * Get a registered raw store from the registry by the given store
   * definition. If the store doesn't exist in the registry yet, it will first
   * create a store, then, register it to the registry so that it can be
   * fetched back on the next call.
   */
  function raw<T>(definition: CompositionDefinition<T>): CompositionStore<T>

  function raw<
    S extends State,
    G extends Getters,
    A extends Actions,
    D extends Definitions
  >(definition: OptionDefinition<S, G, A, D>): OptionStore<S, G, A, D>

  function raw(definition: any): any {
    return getStore(vuex, definition) || createStore(vuex, definition)
  }

  /**
   * Get a reactive version of the store, which provides users direct access to
   * `ref` and `computed` in the composition store. It's particularly useful
   * when consuming composition store inside option syntax Vue Component.
   */
  function store<T>(
    definition: CompositionDefinition<T>
  ): ReactiveCompositionStore<T>

  function store<
    S extends State,
    G extends Getters,
    A extends Actions,
    D extends Definitions
  >(definition: OptionDefinition<S, G, A, D>): OptionStore<S, G, A, D>

  function store(definition: any): any {
    return createReactiveStore(raw(definition))
  }

  const vuex = { registry, install, raw, store, plugins }

  return vuex
}

function getStore<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

function getStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(vuex: Vuex, definition: OptionDefinition<S, G, A, D>): OptionStore<S, G, A, D>

function getStore(vuex: any, definition: any): any {
  return vuex.registry[definition.name] || null
}

function reserveStore<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

function reserveStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(vuex: Vuex, definition: OptionDefinition<S, G, A, D>): OptionStore<S, G, A, D>

function reserveStore(vuex: any, definition: any): any {
  const { name, setup } = definition

  vuex.registry[name] = isFunction(setup) ? {} : reactive({})

  return vuex.registry[name]
}

export function createStore<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

export function createStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(vuex: Vuex, definition: OptionDefinition<S, G, A, D>): OptionStore<S, G, A, D>

export function createStore(vuex: any, definition: any): void {
  // At first, register an empty store to the registry, then update the store
  // afterward. this is for cross-store composition.
  const store = reserveStore(vuex, definition) as any

  isFunction(definition.setup)
    ? createCompositionStore(vuex, store, definition)
    : createOptionStore(vuex, store, definition)

  return store
}

function createCompositionStore<T>(
  vuex: Vuex,
  store: CompositionStore<T>,
  definition: CompositionDefinition<T>
): void {
  setupCompositionStore(vuex, store, definition)
}

function createOptionStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(
  vuex: Vuex,
  store: OptionStore<S, G, A, D>,
  definition: OptionDefinition<S, G, A, D>
): void {
  setupOptionStore(vuex, store, definition)
}

export function createReactiveStore<T>(
  store: CompositionStore<T>
): ReactiveCompositionStore<T>

export function createReactiveStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(store: OptionStore<S, G, A, D>): OptionStore<S, G, A, D>

export function createReactiveStore(store: any): any {
  return isReactive(store) ? store : reactive(store)
}
