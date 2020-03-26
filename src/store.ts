import { reactive, computed, isReactive, UnwrapRef } from 'vue'
import { isString, isFunction } from './utils'
import { Vuex } from './vuex'

export type Store<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {}
> = CompositionStore<T> | OptionStore<S, G, A>

export type CompositionStore<T> = T

export type ReactiveCompositionStore<T = {}> = {
  [P in keyof T]: UnwrapRef<T[P]>
}

export type OptionStore<
  S extends State,
  G extends Getters,
  A extends Actions
> = S & StoreWithGetters<G> & StoreWithActions<A>

export type Definition<
  T,
  S extends State,
  G extends Getters,
  A extends Actions
> = CompositionDefinition<T> | OptionDefinition<S, G, A>

export interface CompositionDefinition<T> {
  name: string
  setup: CompositionSetup<T>
}

export interface OptionDefinition<
  S extends State,
  G extends Getters,
  A extends Actions
> {
  name: string
  setup: OptionSetup<S, G, A>
}

export type Setup<T, S extends State, G extends Getters, A extends Actions> =
  | CompositionSetup<T>
  | OptionSetup<S, G, A>

export interface SetupContext {
  use<T>(definition: CompositionDefinition<T>): CompositionStore<T>
  use<S, G extends Getters, A extends Actions>(
    definition: OptionDefinition<S, G, A>
  ): OptionStore<S, G, A>
}

export type CompositionSetup<T> = (context: SetupContext) => CompositionStore<T>

export interface OptionSetup<
  S extends State,
  G extends Getters,
  A extends Actions
> {
  name: string
  state?: () => S
  getters?: G & ThisType<S & StoreWithGetters<G> & StoreWithActions<A>>
  actions?: A & ThisType<A & S & StoreWithGetters<G> & StoreWithActions<A>>
}

export type State = Record<string, any>

export type Getter = (...args: any[]) => any

export type Getters = Record<string, Getter>

export type StoreWithGetters<G extends Getters> = {
  [K in keyof G]: G[K] extends (...args: any[]) => infer R ? R : never
}

export type Action = (...args: any[]) => any

export type Actions = Record<string, Action>

export type StoreWithActions<A extends Actions> = {
  [K in keyof A]: A[K] extends (this: infer This, ...args: infer P) => infer R
    ? (this: This, ...args: P) => R
    : never
}

export function defineStore<T>(
  name: string,
  setup: CompositionSetup<T>
): CompositionDefinition<T>

export function defineStore<
  S extends State,
  G extends Getters,
  A extends Actions
>(setup: OptionSetup<S, G, A>, never?: never): OptionDefinition<S, G, A>

export function defineStore(maybeSetup: any, setup: any): any {
  return isString(maybeSetup)
    ? { name: maybeSetup, setup }
    : { name: maybeSetup.name, setup: maybeSetup }
}

export function createAndBindStore<T>(
  vuex: Vuex,
  store: CompositionStore<T>,
  setup: CompositionSetup<T>
): void

export function createAndBindStore<
  S extends State,
  G extends Getters,
  A extends Actions
>(vuex: Vuex, store: OptionStore<S, G, A>, setup: OptionSetup<S, G, A>): void

export function createAndBindStore(vuex: Vuex, store: any, setup: any): void {
  isFunction(setup)
    ? createCompositionStore(vuex, store, setup)
    : createOptionStore(store, setup)
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
