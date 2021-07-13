import {
  Ref,
  UnwrapRef,
  WatchOptions,
  WatchCallback,
  getCurrentInstance,
  inject
} from 'vue'
import { isString } from './utils'
import { Vuex, key } from './vuex'
import { setActiveInstance, getActiveInstance } from './container'

export type Store<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {},
  B extends Builds = {}
> = CompositionStore<T> | OptionStore<S, G, A, B>

export type CompositionStore<T> = T extends Ref ? T : UnwrapRef<T>

export type OptionStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
> = S &
  StoreWithGetters<G> &
  StoreWithActions<A> &
  StoreWithModules<B> &
  StoreCustomProperties

export interface StoreCustomProperties {}

export type Builds = Record<string, Build>
export type Build<T = any> = (vuex?: Vuex) => T

export type Definition<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {},
  B extends Builds = {}
> = CompositionDefinition<T> | OptionDefinition<S, G, A, B>

export interface CompositionDefinition<T> {
  key: string
  setup: CompositionSetup<T>
}

export type CompositionSetup<T> = (context: CompositionContext) => T

export interface CompositionContext extends StoreCustomProperties {}

export interface OptionDefinition<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
> {
  key: string
  setup: OptionSetup<S, G, A, B>
}

export interface OptionSetup<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
> {
  key: string
  use?: () => B
  state?: () => S
  getters?: G &
    ThisType<
      S & StoreWithGetters<G> & StoreWithActions<A> & StoreWithModules<B>
    >
  actions?: A &
    ThisType<
      S & A & StoreWithGetters<G> & StoreWithActions<A> & StoreWithModules<B>
    >
  watch?: Watchers<S>
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

export type StoreWithModules<B extends Builds> = {
  [K in keyof B]: ReturnType<B[K]>
}

export type Watchers<S extends State> = {
  [K in keyof S]: Watcher<S[K], S[K]>
}

export type Watcher<V = any, OV = any> = WatchItem<V, OV> | WatchItem<V, OV>[]

export type WatchItem<V = any, OV = any> =
  | string
  | WatchCallback<V, OV>
  | WatchHandler<V, OV>

export type WatchHandler<V = any, OV = any> = {
  handler: string | WatchCallback<V, OV>
} & WatchOptions

export function defineStore<T extends object>(
  key: string,
  setup: CompositionSetup<T>
): Build<CompositionStore<T>>

export function defineStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  B extends Builds
>(setup: OptionSetup<S, G, A, B>, never?: never): Build<OptionStore<S, G, A, B>>

export function defineStore(maybeSetup: any, setup: any): any {
  const definition = isString(maybeSetup)
    ? { key: maybeSetup, setup }
    : { key: maybeSetup.key, setup: maybeSetup }

  return (vuex?: Vuex | null) => {
    const store = getAndSetVuex(vuex).setup(definition)

    unSetVuex()

    return store
  }
}

function getAndSetVuex(vuex?: Vuex | null): Vuex {
  vuex = vuex ?? (getCurrentInstance() && inject(key))

  if (vuex) {
    setActiveInstance(vuex)
  }

  return getActiveInstance()
}

function unSetVuex(): void {
  setActiveInstance(null)
}
