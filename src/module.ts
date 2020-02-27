export type State = Record<string, any>

export type Action<S extends State> = (state: S) => any

export interface Actions<S extends State> {
  [key: string]: Action<S>
}

export interface ModuleDefinition<
  S extends State,
  A extends Record<string, Action<S>>
> {
  state?: () => S
  actions?: A
}

export function createModule<
  S extends State
>(definition: {
  state?: () => S,
  actions?: Actions<S>
}) {
  return definition
}
