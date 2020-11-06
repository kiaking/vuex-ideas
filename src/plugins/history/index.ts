import { Vuex, Plugin, EventTypes } from '../../'
import { LogType, Log, createLog } from './log'

export interface History {
  root: Root
  logs: Log[]
}

export interface Root {
  [name: string]: State
}

export interface State {
  [key: string]: any
}

export function history(): Plugin {
  return (vuex) => installHistory(vuex)
}

function installHistory(vuex: Vuex): void {
  // If the debug option is set to `false`, there's no need for the plugin
  // to be installed, so we'll just skip here.
  if (!vuex.debug) {
    return
  }

  const history = createHistory()

  setupHistory(history, vuex)

  ;(vuex as any).$history = history
}

function createHistory(): History {
  const root: Root = {}
  const logs: Log[] = []

  const history = { root, logs }

  return history
}

function setupHistory(history: History, vuex: Vuex): void {
  vuex.events.on(EventTypes.VuexCreated, () => handleVuexCreated(history))
  vuex.events.on(EventTypes.StoreCreated, () => handleStoreCreated(history))
  vuex.events.on(EventTypes.Mutation, (store, state, value) => handleMutation(history, store, state, value))
}

function pushLog(history: History, log: Log): void {
  history.logs.push(log)
}

function handleVuexCreated(history: History): void {
  const log = createLog(LogType.Activity, {
    message: 'Vuex created.'
  })

  pushLog(history, log)
}

function handleStoreCreated(history: History): void {
  const log = createLog(LogType.Activity, {
    message: 'New store added.'
  })

  pushLog(history, log)
}

function handleMutation(history: History, store: string, state: string, value: any): void {
  const log = createLog(LogType.Mutation, {
    message: 'State mutated.',
    store,
    state,
    value
  })

  pushLog(history, log)
}
