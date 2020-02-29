import { Vuex } from './vuex'

export type Store<T = {}> = {} & T

export interface StoreDefinition<T> {
  name: string
  setup: StoreDefinitionSetup<T>
}

export interface StoreDefinitionSetup<T> {
  (use: <U>(definition: StoreDefinition<U>) => Store<U>): T
}

export function defineStore<T>(name: string, setup: StoreDefinitionSetup<T>): StoreDefinition<T> {
  return { name, setup }
}

export function createStore<T>(vuex: Vuex, store: Store<T>, setup: StoreDefinitionSetup<T>): Store<T> {
  return Object.assign(store, setup(vuex.store))
}
