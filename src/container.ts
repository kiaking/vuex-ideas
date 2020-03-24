import { Store } from './store'

export interface Container {
  stores: ContainerRegistry
  get<T extends Store>(name: string): T | null
  reserve<T extends Store>(name: string): T
  register<T extends Store>(name: string, store: T): void
}

export interface ContainerRegistry {
  [name: string]: Store<any>
}

export function createContainer(): Container {
  const stores: ContainerRegistry = {}

  function get<T extends Store>(name: string): T | null {
    return stores[name] || null
  }

  function reserve<T extends Store>(name: string): T {
    stores[name] = {}

    return stores[name]
  }

  function register<T extends Store>(name: string, store: T): void {
    stores[name] = store
  }

  return {
    stores,
    get,
    reserve,
    register
  }
}
