import { reactive, isReactive } from 'vue'
import { isFunction } from './utils'

type State = Record<string, any>

export function serialize(state: State): State {
  const base: State = {}

  process(isReactive(state) ? state : reactive(state), base)

  return base
}

export function hydrate(base: State, state: State): void {
  process(state, isReactive(base) ? base : reactive(base))
}

function process(state: State, base: State): void {
  for (const key in state) {
    processValue(base, key, state[key])
  }
}

function processValue(state: State, key: string, value: any): void {
  if (isFunction(value)) {
    return
  }

  state[key] = value
}
