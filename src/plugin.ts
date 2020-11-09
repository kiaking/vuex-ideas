import { Vuex } from './vuex'

export type Plugin = (vuex: Vuex, provide: Provide) => void

export type Provide = (name: string, value: any) => void

export function installPlugins(vuex: Vuex, plugins: Plugin[]): void {
  plugins.forEach((plugin) => {
    plugin(vuex, (name, value) => {
      vuex.plugins[name] = value
    })
  })
}
