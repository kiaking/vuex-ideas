import { App, reactive, InjectionKey } from 'vue'
import { isFunction } from './utils'
import * as Marshal from './marshal'
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
import {
  setupCompositionStore,
  setupOptionStore,
  setupReactiveStore
} from './setup'
import { Plugin, installPlugins } from './plugin'

export interface Vuex {
  registries: Registries
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
  replaceAllStates(states: Record<string, State>): void
  replaceState(name: string, state: State): void
  serialize(): Record<string, State>
}

export interface Options {
  plugins?: Plugin[]
}

export interface Registries {
  [name: string]: Registry
}

export interface Registry {
  initialState: State | null
  store?: Store
}

export type Plugins = Record<string, any>

export const vuexKey = ('vuex' as unknown) as InjectionKey<Vuex>

export function createVuex(options: Options = {}): Vuex {
  const vuex = newVuex()

  options.plugins && installPlugins(vuex, options.plugins)

  return vuex
}

function newVuex(): Vuex {
  const registries: Registries = {}
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
    return setupReactiveStore(raw(definition))
  }

  function replaceAllStates(states: Record<string, State>): void {
    performReplaceAllStates(vuex, states)
  }

  function replaceState(name: string, state: State): void {
    performReplaceState(vuex, name, state)
  }

  function serialize(): Record<string, State> {
    return performSerialize(vuex)
  }

  const vuex = {
    registries,
    plugins,
    install,
    raw,
    store,
    replaceAllStates,
    replaceState,
    serialize
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
  D extends Definitions
>(vuex: Vuex, definition: OptionDefinition<S, G, A, D>): OptionStore<S, G, A, D>

function getStore(vuex: any, definition: any): any {
  return vuex.registries[definition.name]?.store ?? null
}

function createStore<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

function createStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(vuex: Vuex, definition: OptionDefinition<S, G, A, D>): OptionStore<S, G, A, D>

function createStore(vuex: any, definition: any): void {
  // At first, register an empty store to the registry, then update the store
  // afterward. this is for cross-store composition.
  const registry = reserveRegistry(vuex, definition) as any

  isFunction(definition.setup)
    ? setupCompositionStore(vuex, registry, definition)
    : setupOptionStore(vuex, registry, definition)

  return registry.store
}

function reserveRegistry<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

function reserveRegistry<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(vuex: Vuex, definition: OptionDefinition<S, G, A, D>): OptionStore<S, G, A, D>

function reserveRegistry(vuex: any, definition: any): any {
  const registries = vuex.registries
  const { name, setup } = definition

  if (!registries[name]) {
    registries[name] = { initialState: null }
  }

  registries[name].store = isFunction(setup) ? {} : reactive({})

  return registries[name]
}

function performReplaceAllStates(
  vuex: Vuex,
  states: Record<string, State>
): void {
  for (const name in states) {
    performReplaceState(vuex, name, states[name])
  }
}

function performReplaceState(vuex: Vuex, name: string, state: State): void {
  vuex.registries[name] = {
    initialState: state
  }
}

function performSerialize(vuex: Vuex): State {
  const state: State = {}

  const registries = vuex.registries

  for (const name in registries) {
    const registry = registries[name]

    if (registry && registry.store) {
      state[name] = Marshal.serialize(registry.store)
    }
  }

  return state
}
