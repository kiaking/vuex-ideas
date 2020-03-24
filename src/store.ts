import { reactive, computed, ComputedRef, UnwrapRef } from 'vue'
import { isString, isFunction } from './utils'
import { Vuex } from './vuex'

export type Store<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {}
> = CompositionStore<T> | OptionStore<S, G, A>

export type CompositionStore<T> = T

export type UnwrappedCompositionStore<T = {}> = {
  [P in keyof T]: UnwrapRef<T[P]>
}

export type OptionStore<
  S extends State,
  G extends Getters,
  A extends Actions
> = StoreWithState<S> & StoreWithGetters<G> & StoreWithActions<A>

export type UnwrappedOptionStore<
  S extends State,
  G extends Getters,
  A extends Actions
> = StoreWithState<S> & StoreWithUnwrappedGetters<G> & StoreWithActions<A>

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
    use: <U, S, G extends Getters, A extends Actions>(
      definition: StoreCompositionDefinition<U> | StoreOptionDefinition<S, G, A>
    ) => S extends State ? OptionStore<S, G, A> : CompositionStore<U>
  ): CompositionStore<T>
}

export type Use<T, S extends State, G extends Getters, A extends Actions> = (definition: StoreDefinition<T, S, G, A>) => T extends StoreCompositionDefinition<T> ? CompositionStore<T> : null

export interface StoreOptionSetup<
  S extends State,
  G extends Getters,
  A extends Actions
> {
  name: string
  state?: () => S
  getters?: G &
    ThisType<
      { [k in keyof G]: G[k] extends (...args: any[]) => infer R ? R : never } &
        StoreWithState<S> &
        StoreWithActions<A>
    >
  actions?: A & ThisType<A & StoreWithState<S> & StoreWithUnwrappedGetters<G>>
}

export type State = Record<string, any>

export interface StoreWithState<S extends State> {
  state: S
}

export type Getter = (...args: any[]) => any

export type Getters = Record<string, Getter>

export type StoreWithGetters<G extends Getters> = {
  [k in keyof G]: G[k] extends (...args: any[]) => infer R
    ? ComputedRef<R>
    : never
}

export type StoreWithUnwrappedGetters<G extends Getters> = {
  [k in keyof G]: G[k] extends (...args: any[]) => infer R ? R : never
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
  isFunction(setup)
    ? createCompositionStore(vuex, store, setup)
    : createOptionStore(store, setup)
}

function createCompositionStore<T>(
  vuex: Vuex,
  store: CompositionStore<T>,
  setup: StoreCompositionSetup<T>
): CompositionStore<T> {
  return Object.assign(store, setup(vuex.store))
}

function createOptionStore<
  S extends State,
  G extends Getters,
  A extends Actions
>(store: OptionStore<S, G, A>, setup: StoreOptionSetup<S, G, A>): void {
  bindState(store, setup.state)
  bindGetters(store, setup.getters)
  bindActions(store, setup.actions)
}

function bindState<S extends State, G extends Getters, A extends Actions>(
  store: OptionStore<S, G, A>,
  state?: () => S
): void {
  return (store.state = reactive(isFunction(state) ? state() : ({} as any)))
}

function bindGetters<S extends State, G extends Getters, A extends Actions>(
  store: OptionStore<S, G, A>,
  getters?: G
): void {
  for (const name in getters) {
    ;(store as any)[`${name}__proxy`] = (function () {
      const fn = getters[name]
      const args = (arguments as unknown) as any[]

      return computed(() => fn.apply(store, args))
    })() as StoreWithGetters<G>[typeof name]

    Object.defineProperty(store, name, {
      get: () => store[`${name}__proxy`].value
    })
  }
}

function bindActions<S extends State, G extends Getters, A extends Actions>(
  store: OptionStore<S, G, A>,
  actions?: A
): void {
  for (const name in actions) {
    ;(store as any)[name] = function () {
      const fn = actions[name]
      const args = (arguments as unknown) as any[]

      return fn.apply(store, args)
    } as StoreWithActions<A>[typeof name]
  }
}
