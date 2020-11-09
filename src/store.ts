import { UnwrapRef, WatchOptions, WatchCallback } from 'vue'
import { isString } from './utils'
import { StateTree, SerializedStateTree } from './revive'

export type Store<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {},
  D extends Definitions = {}
> = CompositionStore<T> | OptionStore<S, G, A, D>

export type CompositionStore<T> = T & {
  $state(): StateTree
  $serialize(): SerializedStateTree
}

export type ReactiveCompositionStore<T> = {
  [P in keyof T]: UnwrapRef<T[P]>
}

export type OptionStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
> = S & StoreWithGetters<G> & StoreWithActions<A> & StoreWithModules<D>

export type Definition<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {},
  D extends Definitions = {}
> = CompositionDefinition<T> | OptionDefinition<S, G, A, D>

export type Definitions = Record<string, Definition>

export interface CompositionDefinition<T> {
  name: Name
  setup: CompositionSetup<T>
}

export interface OptionDefinition<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
> {
  name: Name
  setup: OptionSetup<S, G, A, D>
}

export type CompositionSetup<T> = (context: Context) => T

export interface OptionSetup<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
> {
  name: Name
  use?: () => D
  state?: () => S
  getters?: G &
    ThisType<
      S & StoreWithGetters<G> & StoreWithActions<A> & StoreWithModules<D>
    >
  actions?: A &
    ThisType<
      S & A & StoreWithGetters<G> & StoreWithActions<A> & StoreWithModules<D>
    >
  watch?: Watchers<S>
}

export type Name = string | Symbol

export interface Context {
  use<T>(definition: CompositionDefinition<T>): CompositionStore<T>
  use<
    S extends State,
    G extends Getters,
    A extends Actions,
    D extends Definitions
  >(
    definition: OptionDefinition<S, G, A, D>
  ): OptionStore<S, G, A, D>
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

export type StoreWithModules<D extends Definitions> = {
  [K in keyof D]: D[K] extends CompositionDefinition<any>
    ? ReactiveCompositionStore<ReturnType<D[K]['setup']>>
    : D[K] extends OptionDefinition<infer S, infer G, infer A, infer D>
    ? OptionStore<S, G, A, D>
    : never
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

export function defineStore<T>(
  name: Name,
  setup: CompositionSetup<T>
): CompositionDefinition<T>

export function defineStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
>(setup: OptionSetup<S, G, A, D>, never?: never): OptionDefinition<S, G, A, D>

export function defineStore(maybeSetup: any, setup: any): any {
  return isString(maybeSetup)
    ? { name: maybeSetup, setup }
    : { name: maybeSetup.name, setup: maybeSetup }
}
