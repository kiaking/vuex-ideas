# Vuex

Vuex is the central container that holds all stores registered in the application. It provides a method to retrieve usable store instances.

## Static Methods

### createVuex

Creates a new Vuex instance.

- **Typings:**

  ```ts
  type Plugin = (vuex: Vuex, provide: Provide) => void

  interface Options {
    plugins?: Plugin[]
  }

  function createVuex(options: Options = {}): Vuex
  ```

- **Example:**

  ```ts
  import { createApp } from 'vue'
  import { createVuex } from 'vuex'

  const app = createApp({})

  const vuex = createVuex()

  app.use(vuex)

  app.mount('#app')
  ```

## Instance Properties

### registry

An object that holds registered stores.

- **Type:** `Registry`

  ```ts
  interface Registry {
    [name: string]: Store<any>
  }
  ```

### plugins

An object that holds all registered plugins.

- **Type:** `Record<string, any>`

## Instance Methods

### raw

Registers, and returns a "raw" store from the given store definition.

- **Typings:**

  ```ts
  raw<T>(
    definition: CompositionDefinition<T>
  ): CompositionStore<T>

  raw<
    S extends State,
    G extends Getters,
    A extends Actions,
    D extends Definitions
  >(
    definition: OptionDefinition<S, G, A, D>
  ): OptionStore<S, G, A, D>
  ```

### store

Registers, and returns a "reactive" store from the given store definition.

- **Typings:**

  ```ts
    store<T>(
      definition: CompositionDefinition<T>
    ): ReactiveCompositionStore<T>

    store<
      S extends State,
      G extends Getters,
      A extends Actions,
      D extends Definitions
    >(
      definition: OptionDefinition<S, G, A, D>
    ): OptionStore<S, G, A, D>
  ```
