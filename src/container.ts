import { Vuex } from 'vuex'

let activeInstance: Vuex | null = null

export function setActiveInstance(vuex: Vuex | null): void {
  activeInstance = vuex
}

export function getActiveInstance(): Vuex {
  const vuex = activeInstance

  if (!vuex) {
    throw new Error('No active vuex!')
  }

  return vuex
}
