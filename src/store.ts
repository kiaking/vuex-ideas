import { UnwrapRef } from 'vue'
import { isString } from './utils'

export type Store<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {},
  M extends Modules = {}
> = CompositionStore<T> | OptionStore<S, G, A, M>

export type CompositionStore<T> = T

export type ReactiveCompositionStore<T> = {
  [P in keyof T]: UnwrapRef<T[P]>
}

export type OptionStore<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
> = S & StoreWithGetters<G> & StoreWithActions<A> & StoreWithModules<M>

export type Definition<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {},
  M extends State = {}
> = CompositionDefinition<T> | OptionDefinition<S, G, A, M>

export interface CompositionDefinition<T> {
  name: string
  setup: CompositionSetup<T>
}

export interface OptionDefinition<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
> {
  name: string
  setup: OptionSetup<S, G, A, M>
}

export interface Context {
  use<T>(definition: CompositionDefinition<T>): CompositionStore<T>
  use<S extends State, G extends Getters, A extends Actions, M extends Modules>(
    definition: OptionDefinition<S, G, A, M>
  ): OptionStore<S, G, A, M>
}

export type CompositionSetup<T> = (context: Context) => CompositionStore<T>

export interface OptionSetup<
  S extends State,
  G extends Getters,
  A extends Actions,
  M extends Modules
> {
  name: string
  use?: () => M
  state?: () => S
  getters?: G &
    ThisType<
      S & StoreWithGetters<G> & StoreWithActions<A> & StoreWithModules<M>
    >
  actions?: A &
    ThisType<
      S & A & StoreWithGetters<G> & StoreWithActions<A> & StoreWithModules<M>
    >
}

export type Modules = Record<string, Definition>

export type StoreWithModules<M extends Modules> = {
  [K in keyof M]: M[K] extends CompositionDefinition<any>
    ? ReactiveCompositionStore<ReturnType<M[K]['setup']>>
    : M[K] extends OptionDefinition<infer S, infer G, infer A, infer M>
    ? OptionStore<S, G, A, M>
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
  M extends Modules
>(setup: OptionSetup<S, G, A, M>, never?: never): OptionDefinition<S, G, A, M>

export function defineStore(maybeSetup: any, setup: any): any {
  return isString(maybeSetup)
    ? { name: maybeSetup, setup }
    : { name: maybeSetup.name, setup: maybeSetup }
}
