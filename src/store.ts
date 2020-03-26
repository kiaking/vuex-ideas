import { UnwrapRef } from 'vue'
import { isString } from './utils'

export type Store<
  T = {},
  S extends State = {},
  G extends Getters = {},
  A extends Actions = {}
> = CompositionStore<T> | OptionStore<S, G, A>

export type CompositionStore<T> = T

export type ReactiveCompositionStore<T> = {
  [P in keyof T]: UnwrapRef<T[P]>
}

export type OptionStore<
  S extends State,
  G extends Getters,
  A extends Actions
> = S & StoreWithGetters<G> & StoreWithActions<A>

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

export interface Context {
  use<T>(definition: CompositionDefinition<T>): CompositionStore<T>
  use<S, G extends Getters, A extends Actions>(
    definition: OptionDefinition<S, G, A>
  ): OptionStore<S, G, A>
}

export type CompositionSetup<T> = (context: Context) => CompositionStore<T>

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
