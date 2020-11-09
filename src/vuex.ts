import {
  App,
  reactive,
  isReactive,
  computed,
  watch,
  InjectionKey,
  WatchCallback,
  WatchOptions
} from 'vue'
import { isString, isFunction, isArray } from './utils'
import {
  Store,
  Definitions,
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
  Watchers,
  Watcher,
  WatchItem,
  WatchHandler
} from './store'
import { Plugin, installPlugins } from './plugin'

export interface Vuex {
  registry: Registry
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
  plugins: Plugins
}

export interface Options {
  plugins?: Plugin[]
}

export interface Registry {
  [name: string]: Store<any>
}

type Plugins = Record<string, any>

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
  D extends Definitions
>(
  vuex: Vuex,
  store: OptionStore<S, G, A, D>,
  setup: OptionSetup<S, G, A, D>
): void {
  setup.state && bindState(store, setup.state)
  setup.getters && bindGetters(store, setup.getters)
  setup.actions && bindActions(store, setup.actions)
  setup.use && bindModules(vuex, store, setup.use)
  setup.watch && setupWatchers(store, setup.watch)

  bindPlugins(vuex, store)
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

function bindState<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(store: OptionStore<S, G, A, D>, state: () => S): void {
  bindProperties(store, state(), (v) => v)
}

function bindGetters<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(store: OptionStore<S, G, A, D>, getters: G): void {
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
  D extends Definitions
>(store: OptionStore<S, G, A, D>, actions: A): void {
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
  D extends Definitions
>(
  vuex: Vuex,
  store: OptionStore<S, G, A, D>,
  modules: () => Definitions
): void {
  bindProperties(store, modules(), (module) => vuex.store(module as any))
}

function bindPlugins<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(vuex: Vuex, store: OptionStore<S, G, A, D>): void {
  for (const name in vuex.plugins) {
    ;(store as any)[`$${name}`] = vuex.plugins[name]
  }
}

function bindProperties<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions,
  P extends Record<string, any>
>(
  store: OptionStore<S, G, A, D>,
  properties: P,
  fn: (value: { [K in keyof P]: P[K] }) => any
): void {
  for (const name in properties) {
    store[name] = fn(properties[name])
  }
}

function setupWatchers<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(store: OptionStore<S, G, A, D>, watchers: Watchers<S>): void {
  for (const name in watchers) {
    setupWatcher(store, name, watchers[name])
  }
}

function setupWatcher<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(store: OptionStore<S, G, A, D>, name: string, watcher: Watcher): void {
  if (isArray(watcher)) {
    return setupArrayWatcher(store, name, watcher)
  }

  if (isString(watcher)) {
    return setupStringWatcher(store, name, watcher)
  }

  if (isFunction(watcher)) {
    return setupFunctionWatcher(store, name, watcher)
  }

  return setupObjectWatcher(store, name, watcher)
}

function setupStringWatcher<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(
  store: OptionStore<S, G, A, D>,
  name: string,
  watcher: string,
  options: WatchOptions = {}
): void {
  watch(
    () => store[name],
    (value, oldValue) => store[watcher](value, oldValue),
    options
  )
}

function setupFunctionWatcher<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(
  store: OptionStore<S, G, A, D>,
  name: string,
  watcher: WatchCallback,
  options: WatchOptions = {}
): void {
  watch(() => store[name], watcher, options)
}

function setupObjectWatcher<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(store: OptionStore<S, G, A, D>, name: string, watcher: WatchHandler): void {
  const handler: string | WatchCallback = watcher.handler

  const options: WatchOptions = {
    immediate: watcher.immediate,
    deep: watcher.deep,
    flush: watcher.flush,
    onTrack: watcher.onTrack,
    onTrigger: watcher.onTrigger
  }

  isString(handler)
    ? setupStringWatcher(store, name, handler, options)
    : setupFunctionWatcher(store, name, handler, options)
}

function setupArrayWatcher<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(store: OptionStore<S, G, A, D>, name: string, watcher: WatchItem[]): void {
  watcher.forEach((w) => setupWatcher(store, name, w))
}
