import { reactive, computed } from 'vue'
import { isString, isFunction } from './utils'
import { Vuex } from './vuex'

export type Store<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {}
> = CompositionStore<T> | OptionStore<S, G, A>

export type CompositionStore<T> = T

export type OptionStore<
  S extends State,
  G extends Getters,
  A extends Actions
> = StoreWithState<S> & StoreWithGetters<G> & StoreWithActions<A>

export type StoreDefinition<
  T,
  S extends State,
  G extends Getters,
  A extends Actions
> = StoreCompositionDefinition<T> | StoreOptionDefinition<S, G, A>

export interface StoreDefinitionBase {
  name: string
}

export interface StoreCompositionDefinition<T> extends StoreDefinitionBase {
  setup: StoreCompositionSetup<T>
}

export interface StoreOptionDefinition<
  S extends State,
  G extends Getters,
  A extends Actions
> extends StoreDefinitionBase {
  setup: StoreOptionSetup<S, G, A>
}

export type StoreSetup<
  T,
  S extends State,
  G extends Getters,
  A extends Actions
> = StoreCompositionSetup<T> | StoreOptionSetup<S, G, A>

export interface StoreCompositionSetup<T> {
  (
    use: <U, S extends State, G extends Getters, A extends Actions>(
      definition: StoreDefinition<U, S, G, A>
    ) => Store<U, S, G, A>
  ): CompositionStore<T>
}

export interface StoreOptionSetup<
  S extends State,
  G extends Getters,
  A extends Actions
> {
  name: string
  state?: () => S
  getters?: G & ThisType<G & StoreWithState<S> & StoreWithActions<A>>
  actions?: A & ThisType<A & StoreWithState<S> & StoreWithGetters<G>>
}

export type State = Record<string, any>

export interface StoreWithState<S extends State> {
  state: S
}

export type Getter = (...args: any[]) => any

export type Getters = Record<string, Getter>

export type StoreWithGetters<G extends Getters> = {
  [k in keyof G]: G[k] extends (this: infer This, ...args: infer P) => infer R
    ? (this: This, ...args: P) => R
    : never
}

export type Action = (...args: any[]) => any

export type Actions = Record<string, Action>

export type StoreWithActions<A extends Actions> = {
  [k in keyof A]: A[k] extends (this: infer This, ...args: infer P) => infer R
    ? (this: This, ...args: P) => R
    : never
}

export function defineStore<T>(
  name: string,
  setup: StoreCompositionSetup<T>
): StoreCompositionDefinition<T>

export function defineStore<
  S extends State,
  G extends Getters,
  A extends Actions
>(
  setup: StoreOptionSetup<S, G, A>,
  never?: never
): StoreOptionDefinition<S, G, A>

export function defineStore(maybeDefinition: any, setup: any): any {
  return isString(maybeDefinition)
    ? defineCompositionStore(maybeDefinition, setup)
    : defineOptionStore(maybeDefinition)
}

function defineCompositionStore<T>(
  name: string,
  setup: StoreCompositionSetup<T>
): StoreCompositionDefinition<T> {
  return { name, setup }
}

function defineOptionStore<
  S extends State,
  G extends Getters,
  A extends Actions
>(setup: StoreOptionSetup<S, G, A>) {
  return { name: setup.name, setup }
}

export function createAndBindStore<T>(
  vuex: Vuex,
  store: CompositionStore<T>,
  setup: StoreCompositionSetup<T>
): void

export function createAndBindStore<
  S extends State,
  G extends Getters,
  A extends Actions
>(
  vuex: Vuex,
  store: OptionStore<S, G, A>,
  setup: StoreOptionSetup<S, G, A>
): void

export function createAndBindStore(vuex: Vuex, store: any, setup: any): void {
  const s = isFunction(setup)
    ? createCompositionStore(vuex, setup)
    : createOptionStore(setup)

  Object.assign(store, s)
}

function createCompositionStore<T>(
  vuex: Vuex,
  setup: StoreCompositionSetup<T>
): CompositionStore<T> {
  return setup(vuex.store)
}

function createOptionStore<
  S extends State,
  G extends Getters,
  A extends Actions
>(setup: StoreOptionSetup<S, G, A>): OptionStore<S, G, A> {
  const store = {} as OptionStore<S, G, A>

  const state = createState(setup.state)
  const getters = createGetters(store, setup.getters)
  const actions = createActions(store, setup.actions)

  store.state = state

  Object.assign(store, getters)
  Object.assign(store, actions)

  return store
}

function createState<S extends State>(state?: () => S): S {
  return reactive(isFunction(state) ? state() : ({} as any))
}

function createGetters<S extends State, G extends Getters, A extends Actions>(
  store: OptionStore<S, G, A>,
  getters?: G
): StoreWithGetters<G> {
  const wrappedGetters: StoreWithGetters<G> = {} as StoreWithGetters<G>

  for (const name in getters) {
    wrappedGetters[name] = function () {
      const fn = getters[name]
      const args = (arguments as unknown) as any[]

      return computed(() => fn.apply(store, args))
    } as StoreWithGetters<G>[typeof name]
  }

  return wrappedGetters
}

function createActions<S extends State, G extends Getters, A extends Actions>(
  store: OptionStore<S, G, A>,
  actions?: A
): StoreWithActions<A> {
  const wrappedActions = {} as StoreWithActions<A>

  for (const name in actions) {
    wrappedActions[name] = function () {
      const fn = actions[name]
      const args = (arguments as unknown) as any[]

      return fn.apply(store, args)
    } as StoreWithActions<A>[typeof name]
  }

  return wrappedActions
}
