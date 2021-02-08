import { WatchCallback, WatchOptions, computed, watch } from 'vue'
import { isString, isFunction, isArray } from './utils'
import { Vuex } from './vuex'
import {
  CompositionStore,
  OptionStore,
  Builds,
  CompositionDefinition,
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
  store: CompositionStore<T>,
  definition: CompositionDefinition<T>
): void {
  console.log('CF', definition.key)
  const state = definition.setup.bind(vuex)({ ...vuex.plugins })

  Object.assign(store, state)
}

export function setupOptionStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
>(
  vuex: Vuex,
  store: OptionStore<S, G, A, B>,
  definition: OptionDefinition<S, G, A, B>
): void {
  const { setup } = definition

  setup.state && bindState(store, setup.state)
  setup.getters && bindGetters(store, setup.getters)
  setup.actions && bindActions(store, setup.actions)
  setup.use && bindModules(vuex, store, setup.use)
  setup.watch && setupWatchers(store, setup.watch)
  bindPlugins(vuex, store)
}

function bindState<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
>(store: OptionStore<S, G, A, B>, state: () => S): void {
  bindProperties(store, state(), (v) => v)
}

function bindGetters<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
>(store: OptionStore<S, G, A, B>, getters: G): void {
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
  B extends Builds
>(store: OptionStore<S, G, A, B>, actions: A): void {
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
  B extends Builds
>(vuex: Vuex, store: OptionStore<S, G, A, B>, builds: () => Builds): void {
  bindProperties(store, builds(), (build) => vuex.store(build as any))
}

function bindPlugins<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
>(vuex: Vuex, store: OptionStore<S, G, A, B>): void {
  for (const name in vuex.plugins) {
    ;(store as any)[`$${name}`] = vuex.plugins[name]
  }
}

function bindProperties<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds,
  P extends Record<string, any>
>(
  store: OptionStore<S, G, A, B>,
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
  B extends Builds
>(store: OptionStore<S, G, A, B>, watchers: Watchers<S>): void {
  for (const name in watchers) {
    setupWatcher(store, name, watchers[name])
  }
}

function setupWatcher<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
>(store: OptionStore<S, G, A, B>, name: string, watcher: Watcher): void {
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
  B extends Builds
>(
  store: OptionStore<S, G, A, B>,
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
  B extends Builds
>(
  store: OptionStore<S, G, A, B>,
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
  B extends Builds
>(store: OptionStore<S, G, A, B>, name: string, watcher: WatchHandler): void {
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
  B extends Builds
>(store: OptionStore<S, G, A, B>, name: string, watcher: WatchItem[]): void {
  watcher.forEach((w) => setupWatcher(store, name, w))
}
