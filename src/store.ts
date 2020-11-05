import { UnwrapRef } from 'vue'
import { isString } from './utils'

export type Store<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {},
  D extends Definitions = {}
> = CompositionStore<T> | OptionStore<S, G, A, D>

export type CompositionStore<T> = T

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
  name: string
  setup: CompositionSetup<T>
}

export interface OptionDefinition<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
> {
  name: string
  setup: OptionSetup<S, G, A, D>
}

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

export type CompositionSetup<T> = (context: Context) => CompositionStore<T>

export interface OptionSetup<
  S extends State,
  G extends Getters,
  A extends Actions,
  D extends Definitions
> {
  name: string
  use?: () => D
  state?: () => S
  watch?: WatchOptions
  getters?: G &
    ThisType<
      S & StoreWithGetters<G> & StoreWithActions<A> & StoreWithModules<D>
    >
  actions?: A &
    ThisType<
      S & A & StoreWithGetters<G> & StoreWithActions<A> & StoreWithModules<D>
    >
}

export type WatchOptions = Record<string, WatchOptionItem>

export type WatchOptionItem<V = any, OV = any> = (value: V, oldValue: OV) => any

export type StoreWithModules<D extends Definitions> = {
  [K in keyof D]: D[K] extends CompositionDefinition<any>
    ? ReactiveCompositionStore<ReturnType<D[K]['setup']>>
    : D[K] extends OptionDefinition<infer S, infer G, infer A, infer D>
    ? OptionStore<S, G, A, D>
    : never
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
  A extends Actions,
  D extends Definitions
>(setup: OptionSetup<S, G, A, D>, never?: never): OptionDefinition<S, G, A, D>

export function defineStore(maybeSetup: any, setup: any): any {
  return isString(maybeSetup)
    ? { name: maybeSetup, setup }
    : { name: maybeSetup.name, setup: maybeSetup }
}
