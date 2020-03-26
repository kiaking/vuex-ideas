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
  Actions
} from './store'

export interface Vuex {
  registry: Registry
  install(app: App, vuex: Vuex): void
  raw<T>(definition: CompositionDefinition<T>): CompositionStore<T>
  raw<S extends State, G extends Getters, A extends Actions>(
    definition: OptionDefinition<S, G, A>
  ): OptionStore<S, G, A>
  store<T>(definition: CompositionDefinition<T>): ReactiveCompositionStore<T>
  store<S extends State, G extends Getters, A extends Actions>(
    definition: OptionDefinition<S, G, A>
  ): OptionStore<S, G, A>
}

export interface Registry {
  [name: string]: Store<any>
}

export const vuexKey = ('vuex' as unknown) as InjectionKey<Vuex>

export function createVuex(): Vuex {
  const registry = {} as Registry

  function install(app: App): void {
    app.provide(vuexKey, vuex)
  }

  /**
   * Get a registered raw store from the registry by the given store
   * definition. If the store doesn't exist in the registry yet, it will first
   * create a store, then, register it to the registry so that it can be
   * fetched back on the next call.
   */
  function raw<T>(definition: CompositionDefinition<T>): CompositionStore<T>

  function raw<S extends State, G extends Getters, A extends Actions>(
    definition: OptionDefinition<S, G, A>
  ): OptionStore<S, G, A>

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

  function store<S extends State, G extends Getters, A extends Actions>(
    definition: OptionDefinition<S, G, A>
  ): OptionStore<S, G, A>

  function store(definition: any): any {
    return createReactiveStore(raw(definition))
  }

  const vuex = { registry, install, raw, store }

  return vuex
}

function get<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

function get<S extends State, G extends Getters, A extends Actions>(
  vuex: Vuex,
  definition: OptionDefinition<S, G, A>
): OptionStore<S, G, A>

function get(vuex: any, definition: any): any {
  return vuex.registry[definition.name] || null
}

function reserve<T>(
  vuex: Vuex,
  definition: CompositionDefinition<T>
): CompositionStore<T>

function reserve<S extends State, G extends Getters, A extends Actions>(
  vuex: Vuex,
  definition: OptionDefinition<S, G, A>
): OptionStore<S, G, A>

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
  A extends Actions
>(vuex: Vuex, definition: OptionDefinition<S, G, A>): OptionStore<S, G, A>

export function createStore(vuex: any, definition: any): void {
  // At first, register an empty store to the registry, then update the store
  // afterward. this is for cross-store composition.
  const store = reserve(vuex, definition) as any

  isFunction(definition.setup)
    ? createCompositionStore(vuex, store, definition.setup)
    : createOptionStore(store, definition.setup)

  return store
}

function createCompositionStore<T>(
  vuex: Vuex,
  store: CompositionStore<T>,
  setup: CompositionSetup<T>
): CompositionStore<T> {
  return Object.assign(store, setup({ use: vuex.raw }))
}

function createOptionStore<
  S extends State,
  G extends Getters,
  A extends Actions
>(store: OptionStore<S, G, A>, setup: OptionSetup<S, G, A>): void {
  setup.state && bindState(store, setup.state)
  setup.getters && bindGetters(store, setup.getters)
  setup.actions && bindActions(store, setup.actions)
}

function bindState<S extends State, G extends Getters, A extends Actions>(
  store: OptionStore<S, G, A>,
  state: () => S
): void {
  bindProperties(store, state(), (v) => v)
}

function bindGetters<S extends State, G extends Getters, A extends Actions>(
  store: OptionStore<S, G, A>,
  getters: G
): void {
  bindProperties(store, getters, (getter) => {
    return (function () {
      const fn = getter
      const args = arguments
      return computed(() => fn.apply(store, args))
    })()
  })
}

function bindActions<S extends State, G extends Getters, A extends Actions>(
  store: OptionStore<S, G, A>,
  actions: A
): void {
  bindProperties(store, actions, (action) => {
    return function () {
      const fn = action
      const args = arguments
      return fn.apply(store, args)
    }
  })
}

function bindProperties<
  S extends State,
  G extends Getters,
  A extends Actions,
  P extends Record<string, any>
>(
  store: OptionStore<S, G, A>,
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
  A extends Actions
>(store: OptionStore<S, G, A>): OptionStore<S, G, A>

export function createReactiveStore(store: any): any {
  return isReactive(store) ? store : reactive(store)
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
