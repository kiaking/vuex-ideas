import { Vuex } from './vuex'

export type Plugin = (vuex: Vuex, provide: Provide) => void

export type Provide = (name: string, value: any) => void
