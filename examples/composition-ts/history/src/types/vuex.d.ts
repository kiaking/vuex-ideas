import { History } from '/@vuex/'

declare module '/@vuex/' {
  interface Vuex {
    $history: History
  }
}
