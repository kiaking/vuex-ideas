import { App, reactive, InjectionKey } from 'vue'
import { isFunction } from './utils'
import {
  Store,
  CompositionStore,
  OptionStore,
  Builds,
  Build,
  CompositionDefinition,
  OptionDefinition,
  State,
  Getters,
  Actions
} from './store'
import { setupCompositionStore, setupOptionStore } from './setup'
import { Plugin, installPlugins } from './plugin'

export interface Vuex {
  /**
   * The registries that holds instantiated stores.
   */
  registries: Registries

  /**
   * The plugins registered to the vuex instance.
   */
  plugins: Plugins

  /**
   * Install vuex to the vue app instance.
   */
  install(app: App): void

  /**
   * Create or retrieve store instance from the registries.
   */
  store<T>(build: Build<T>): T

  /**
   * Get registered store for the given store definition, or create one and
   * register it if it doesn't already exist.
   */
  setup<T>(definition: CompositionDefinition<T>): CompositionStore<T>

  setup<
    S extends State = {},
    G extends Getters = {},
    A extends Actions = {},
    B extends Builds = {}
  >(
    definition: OptionDefinition<S, G, A, B>
  ): OptionStore<S, G, A, B>
}

export interface Options {
  plugins?: Plugin[]
}

export interface Registries {
  [name: string]: Store
}

export type Plugins = Record<string, any>

export const key = 'vuex' as unknown as InjectionKey<Vuex>

export function createVuex(options: Options = {}): Vuex {
  const vuex = newVuex()

  options.plugins && installPlugins(vuex, options.plugins)

  return vuex
}

function newVuex(): Vuex {
  const registries: Registries = {}
  const plugins: Plugins = {}

  function install(app: App): void {
    app.provide(key, vuex)
    app.config.globalProperties.$vuex = vuex
  }

  function store<T>(build: Build<T>): T {
    return build(vuex)
  }

  function setup<T>(definition: CompositionDefinition<T>): CompositionStore<T>

  function setup<
    S extends State = {},
    G extends Getters = {},
    A extends Actions = {},
    B extends Builds = {}
  >(definition: OptionDefinition<S, G, A, B>): OptionStore<S, G, A, B>

  function setup(definition: any): any {
    return getStore(vuex, definition) || createStore(vuex, definition)
  }

  const vuex = {
    registries,
    plugins,
    install,
    store,
    setup
  }

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
  B extends Builds
>(vuex: Vuex, definition: OptionDefinition<S, G, A, B>): OptionStore<S, G, A, B>

function getStore(vuex: any, definition: any): any {
  return vuex.registries[definition.key] ?? null
}

function createStore<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

function createStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
>(vuex: Vuex, definition: OptionDefinition<S, G, A, B>): OptionStore<S, G, A, B>

function createStore(vuex: any, definition: any): void {
  // At first, register an empty store to the registry, then update the store
  // afterward. this is for cross-store composition.
  const store = reserveStore(vuex, definition) as any

  isFunction(definition.setup)
    ? setupCompositionStore(vuex, store, definition)
    : setupOptionStore(vuex, store, definition)

  return store
}

function reserveStore<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

function reserveStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
>(vuex: Vuex, definition: OptionDefinition<S, G, A, B>): OptionStore<S, G, A, B>

function reserveStore(vuex: any, definition: any): any {
  const registries = vuex.registries
  const key = definition.key

  registries[key] = reactive({})

  return registries[key]
}
