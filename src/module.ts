export type State = Record<string, any>

export interface StoreWithState<S extends State> {
  state: S
}

export type Getter = (...args: any[]) => any

export type StoreWithGetters<G extends Record<string, Getter>> = {
  [k in keyof G]: G[k] extends (this: infer This, ...args: infer P) => infer R
    ? (this: This, ...args: P) => R
    : never
}

export type Action = (...args: any[]) => any

export type StoreWithActions<A extends Record<string, Action>> = {
  [k in keyof A]: A[k] extends (this: infer This, ...args: infer P) => infer R
    ? (this: This, ...args: P) => R
    : never
}

export type Module<
  S extends State = State,
  G extends Record<string, Getter> = Record<string, Getter>,
  A extends Record<string, Action> = Record<string, Action>
> = { name: string } & StoreWithState<S> &
  StoreWithGetters<G> &
  StoreWithActions<A>

export interface ModuleDefinition<
  S extends State = State,
  G extends Record<string, Getter> = Record<string, Getter>,
  A extends Record<string, Action> = Record<string, Action>
> {
  name: string
  state?: () => S
  getters?: G & ThisType<G & StoreWithState<S> & StoreWithActions<A>>
  actions?: A & ThisType<A & StoreWithState<S> & StoreWithGetters<G>>
  use?: Record<string, any>
}

export function createModule<
  S extends State,
  G extends Record<string, Getter>,
  A extends Record<string, Action>
>(definition: ModuleDefinition<S, G, A>) {
  return definition
}
