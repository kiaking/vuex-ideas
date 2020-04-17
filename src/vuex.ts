import { App, InjectionKey, reactive, isReactive, computed, inject } from 'vue'
import { isFunction } from './utils'
import {
  Store,
  CompositionStore,
  ReactiveCompositionStore,
  OptionStore,
  CompositionDefinition,
  OptionDefinition,
  CompositionSetup,
  OptionSetup,
  State,
  Getters,
  Actions,
  Modules
} from './store'
import { Plugin } from './plugin'
import { mixin } from './mixin'

export interface Vuex {
  registry: Registry
  install(app: App, vuex: Vuex): void
  raw<T>(definition: CompositionDefinition<T>): CompositionStore<T>
  raw<S extends State, G extends Getters, A extends Actions, M extends Modules>(
    definition: OptionDefinition<S, G, A, M>
  ): OptionStore<S, G, A, M>
  store<T>(definition: CompositionDefinition<T>): ReactiveCompositionStore<T>
  store<
    S extends State,
    G extends Getters,
    A extends Actions,
    M extends Modules
  >(
    definition: OptionDefinition<S, G, A, M>
  ): OptionStore<S, G, A, M>
  plugins: Plugins
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
  const registry = {} as Registry

  function install(app: App): void {
    mixin(app, vuex)
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
    M extends Modules
  >(definition: OptionDefinition<S, G, A, M>): OptionStore<S, G, A, M>

  function raw(definition: any): any {
    return get(vuex, definition) || createStore(vuex, definition)
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
    M extends Modules
  >(definition: OptionDefinition<S, G, A, M>): OptionStore<S, G, A, M>

  function store(definition: any): any {
    return createReactiveStore(raw(definition))
  }

  const plugins = {} as Plugins

  const vuex = { registry, install, raw, store, plugins }

  if (options.plugins) {
    options.plugins.forEach((plugin) => {
      plugin(vuex, (name, value) => { plugins[name] = value })
    })
  }

  return vuex
}

function get<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

function get<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
>(vuex: Vuex, definition: OptionDefinition<S, G, A, M>): OptionStore<S, G, A, M>

function get(vuex: any, definition: any): any {
  return vuex.registry[definition.name] || null
}

function reserve<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

function reserve<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
>(vuex: Vuex, definition: OptionDefinition<S, G, A, M>): OptionStore<S, G, A, M>

function reserve(vuex: any, definition: any): any {
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
  M extends Modules
>(vuex: Vuex, definition: OptionDefinition<S, G, A, M>): OptionStore<S, G, A, M>

export function createStore(vuex: any, definition: any): void {
  // At first, register an empty store to the registry, then update the store
  // afterward. this is for cross-store composition.
  const store = reserve(vuex, definition) as any

  isFunction(definition.setup)
    ? createCompositionStore(vuex, store, definition.setup)
    : createOptionStore(vuex, store, definition.setup)

  return store
}

function createCompositionStore<T>(
  vuex: Vuex,
  store: CompositionStore<T>,
  setup: CompositionSetup<T>
): CompositionStore<T> {
  return Object.assign(store, setup({ use: vuex.raw, ...vuex.plugins }))
}

function createOptionStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
>(
  vuex: Vuex,
  store: OptionStore<S, G, A, M>,
  setup: OptionSetup<S, G, A, M>
): void {
  setup.state && bindState(store, setup.state)
  setup.getters && bindGetters(store, setup.getters)
  setup.actions && bindActions(store, setup.actions)
  setup.use && bindModules(vuex, store, setup.use)

  bindPlugins(vuex, store)
}

function bindState<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
>(store: OptionStore<S, G, A, M>, state: () => S): void {
  bindProperties(store, state(), (v) => v)
}

function bindGetters<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
>(store: OptionStore<S, G, A, M>, getters: G): void {
  bindProperties(store, getters, (getter) => {
    return (function () {
      const fn = getter
      const args = arguments
      return computed(() => fn.apply(store, args))
    })()
  })
}

function bindActions<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
>(store: OptionStore<S, G, A, M>, actions: A): void {
  bindProperties(store, actions, (action) => {
    return function () {
      const fn = action
      const args = arguments
      return fn.apply(store, args)
    }
  })
}

function bindModules<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
>(vuex: Vuex, store: OptionStore<S, G, A, M>, modules: () => Modules): void {
  bindProperties(store, modules(), (module) => vuex.store(module as any))
}

function bindPlugins<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
>(vuex: Vuex, store: OptionStore<S, G, A, M>): void {
  for (const name in vuex.plugins) {
    ;(store as any)[`$${name}`] = vuex.plugins[name]
  }
}

function bindProperties<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules,
  P extends Record<string, any>
>(
  store: OptionStore<S, G, A, M>,
  properties: P,
  fn: (value: { [K in keyof P]: P[K] }) => any
): void {
  for (const name in properties) {
    ;(store as any)[name] = fn(properties[name])
  }
}

export function createReactiveStore<T>(
  store: CompositionStore<T>
): ReactiveCompositionStore<T>

export function createReactiveStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
>(store: OptionStore<S, G, A, M>): OptionStore<S, G, A, M>

export function createReactiveStore(store: any): any {
  return isReactive(store) ? store : reactive(store)
}

export function useVuex(): Vuex {
  return inject(vuexKey)!
}

export function useStore<T>(
  definition: CompositionDefinition<T>
): CompositionStore<T>

export function useStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
>(definition: OptionDefinition<S, G, A, M>): OptionStore<S, G, A, M>

export function useStore(definition: any): any {
  return useVuex().raw(definition)
}
