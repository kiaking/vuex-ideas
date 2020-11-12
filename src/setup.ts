import {
  reactive,
  isReactive,
  computed,
  watch,
  WatchCallback,
  WatchOptions
} from 'vue'
import { isString, isFunction, isArray } from './utils'
import * as Marshal from './marshal'
import { Vuex, Registry } from './vuex'
import {
  Definitions,
  CompositionStore,
  CompositionDefinition,
  ReactiveCompositionStore,
  OptionStore,
  OptionDefinition,
  State,
  Getters,
  Actions,
  Watchers,
  Watcher,
  WatchItem,
  WatchHandler
} from './store'

export function setupCompositionStore<T>(
  vuex: Vuex,
  registry: Registry,
  definition: CompositionDefinition<T>
): void {
  const state = definition.setup({ use: vuex.raw, ...vuex.plugins })

  Object.assign(registry.store, state)

  hydrateRegistry(registry)
}

export function setupOptionStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(
  vuex: Vuex,
  registry: Registry,
  definition: OptionDefinition<S, G, A, D>
): void {
  const store = registry.store! as OptionStore<S, G, A, D>

  definition.setup.state && bindState(store, definition.setup.state)

  // If an initial state is set to the registry, we'll hydrate the state here
  // before binding any other properties such as getters and actions. This way,
  // we can avoid any side effects from being performed, for example,
  // watcher callbacks.
  hydrateRegistry(registry)

  definition.setup.getters && bindGetters(store, definition.setup.getters)
  definition.setup.actions && bindActions(store, definition.setup.actions)
  definition.setup.use && bindModules(vuex, store, definition.setup.use)
  definition.setup.watch && setupWatchers(store, definition.setup.watch)

  bindPlugins(vuex, store)
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

export function setupReactiveStore<T>(
  store: CompositionStore<T>
): ReactiveCompositionStore<T>

export function setupReactiveStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(store: OptionStore<S, G, A, D>): OptionStore<S, G, A, D>

export function setupReactiveStore(store: any): any {
  return isReactive(store) ? store : reactive(store)
}

function hydrateRegistry(registry: Registry): void {
  if (!registry.initialState) {
    return
  }

  Marshal.hydrate(registry.store!, registry.initialState)

  registry.initialState = null
}
