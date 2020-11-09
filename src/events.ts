import { Vuex } from './vuex'
import { Store } from './store'
import { StackFrame } from './stack-trace'

export interface Events {
  listerners: EventListeners
  on<T extends EventTypes>(event: T, callback: EventCallback<T>): void
  emit<T extends EventTypes>(event: T, ...args: EventCallbackArgs<T>): void
}

export enum EventTypes {
  VuexCreated = 'VUEX_CREATED',
  StoreCreated = 'STORE_CREATED',
  Mutation = 'MUTATION'
}

export type EventListeners<T extends EventTypes = EventTypes> = {
  [V in T]?: EventCallback<V>[]
}

export interface EventCallbacks {
  [EventTypes.VuexCreated]: EventVuexCreatedCallback
  [EventTypes.StoreCreated]: EventStoreCreatedCallback
  [EventTypes.Mutation]: EventMutationCallback
}

export type EventCallback<T extends EventTypes> = EventCallbacks[T]

export type EventVuexCreatedCallback = (vuex: Vuex) => void
export type EventStoreCreatedCallback = (vuex: Vuex, store: Store) => void
export type EventMutationCallback = (store: string | Symbol, state: string, value: any, stack: StackFrame[]) => void

export type EventCallbackArgs<T extends EventTypes> = EventCallback<T> extends (...args: infer A) => any ? A : never

export function createEvents(): Events {
  const listerners: EventListeners = {}

  function on<T extends EventTypes>(event: T, callback: EventCallback<T>): void {
    if (!listerners[event]) {
      listerners[event] = []
    }

    (listerners[event] as EventCallback<T>[]).push(callback)
  }

  function emit<T extends EventTypes>(event: T, ...args: EventCallbackArgs<T>): void {
    const stack = listerners[event] as EventCallback<T>[]

    if (stack) {
      stack.forEach((listener: any) => listener(...args))
    }
  }

  return {
    listerners,
    on,
    emit
  }
}

export function fireVuexCreated(vuex: Vuex): void {
  vuex.events.emit(EventTypes.VuexCreated, vuex)
}

export function fireStoreCreated(vuex: Vuex, store: Store): void {
  vuex.events.emit(EventTypes.StoreCreated, vuex, store)
}

export function fireMutation(vuex: Vuex, store: string | Symbol, state: string, value: any, stack: StackFrame[]): void {
  vuex.events.emit(EventTypes.Mutation, store, state, value, stack)
}
