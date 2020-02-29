import { Store } from './store'

export interface Container {
  stores: ContainerRegistry
  get<T>(name: string): Store<T> | null
  reserve<T>(name: string): Store<T>
  register<T>(name: string, store: Store<T>): void
}

export interface ContainerRegistry {
  [name: string]: Store<any>
}

export function createContainer(): Container {
  const stores: ContainerRegistry = {}

  function get<T>(name: string): Store<T> | null {
    return stores[name] ?? null
  }

  function reserve<T>(name: string): Store<T> {
    stores[name] = {}

    return stores[name]
  }

  function register<T>(name: string, store: Store<T>): void {
    stores[name] = store
  }

  return {
    stores,
    get,
    reserve,
    register
  }
}
