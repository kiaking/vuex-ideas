export interface Store<T> {
  use(): T
}

export interface StoreOptions<T> {
  setup(): T
}

export function createStore<T>(options: StoreOptions<T>): T {
  return options.setup()
}
