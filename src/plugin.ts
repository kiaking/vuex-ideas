import { Vuex } from './vuex'

export type Plugin = (context: PluginContext) => void

export interface PluginContext {
  vuex: Vuex
  provide: Provide
}

export type Provide = (name: string, value: any) => void

export function installPlugins(vuex: Vuex, plugins: Plugin[]): void {
  plugins.forEach((plugin) => {
    function provide(name: string, value: any): void {
      vuex.plugins[name] = value
    }

    plugin({ vuex, provide })
  })
}
