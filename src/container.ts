import { reactive } from 'vue'
import { Store } from './store'

export interface Container {
  stores: Registry
  get<T extends Store>(name: string): T | null
  reservePlain<T extends Store>(name: string): T
  reserveReactive<T extends Store>(name: string): T
  register<T extends Store>(name: string, store: T): void
}

export interface Registry {
  [name: string]: Store<any>
}

export function createContainer(): Container {
  const stores: Registry = {}

  function get<T extends Store>(name: string): T | null {
    return stores[name] || null
  }

  function reservePlain<T extends Store>(name: string): T {
    stores[name] = {}
    return stores[name]
  }

  function reserveReactive<T extends Store>(name: string): T {
    stores[name] = reactive({})
    return stores[name]
  }

  function register<T extends Store>(name: string, store: T): void {
    stores[name] = store
  }

  return {
    stores,
    get,
    reservePlain,
    reserveReactive,
    register
  }
}
