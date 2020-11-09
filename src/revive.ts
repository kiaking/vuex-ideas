import { Ref, isReadonly, isRef } from 'vue'
import { isFunction, isObject } from './utils'

export interface StateTree {
  [key: string]: any
}

export interface SerializedState {
  isRef: boolean
  value: any
}

export interface SerializedStateTree {
  [key: string]: SerializedState
}

export function serialize(tree: StateTree): SerializedStateTree {
  const state = {} as StateTree

  for (const key in tree) {
    const value = tree[key]
    const serializedValue = serializeValue(value)

    if (serializedValue !== undefined) {
      state[key] = serializedValue
    }
  }

  return state
}

function serializeValue(value: any): SerializedState | undefined {
  if (isFunction(value)) {
    return undefined
  }

  if (isRef(value)) {
    // If the value is Ref and also Readonly, then the value must be computed
    // so we'll ignore the value here.
    if (isReadonly(value)) {
      return undefined
    }

    return serializeRef(value)
  }

  if (isObject(value)) {
    return serializeObject(value)
  }

  return serializeStatic(value)
}

function serializeStatic(
  value: string | number | boolean | null
): SerializedState {
  return { isRef: false, value }
}

function serializeObject(value: object): SerializedState {
  return { isRef: false, value: serialize(value) }
}

function serializeRef(value: Ref): SerializedState {
  return { isRef: true, value: value.value }
}
