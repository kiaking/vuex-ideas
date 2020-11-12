import { Ref, isRef, reactive, isReactive } from 'vue'
import { enableTracking, pauseTracking } from '@vue/reactivity'
import { isArray, isObject, isFunction } from './utils'

export type State = Record<string, any>

export function serialize(state: State): State {
  const base: State = {}
  const plainState = unwrapReactive(state)

  for (const key in plainState) {
    base[key] = serializeValue(plainState[key])
  }

  return base
}

function serializeValue<T>(value: T): any {
  if (isRef(value)) {
    return serializeRef(value)
  }

  if (isArray(value)) {
    return serializeArray(value)
  }

  if (isObject(value)) {
    return serialize(value)
  }

  if (isFunction(value)) {
    return undefined
  }

  return value
}

function serializeArray<T>(array: T[]): any[] {
  return array.map((value) => serializeValue(value))
}

function serializeRef<T>(ref: Ref<T>): T | undefined {
  return isComputed(ref) ? undefined : ref.value
}

export function hydrate(base: State, state: State): void {
  pauseTracking()

  const reactiveBase = makeReactive(base)

  for (const key in state) {
    reactiveBase[key] = serializeValue(state[key])
  }

  // enableTracking()
}

function makeReactive<T extends State>(state: T) {
  return isReactive(state) ? state : reactive(state)
}

function unwrapReactive<T extends State>(state: T): T {
  return isReactive(state) ? state['__v_raw'] : state
}

function isComputed<T>(value: Ref<T>): boolean {
  return (value as any)['_rawValue'] === undefined
}
