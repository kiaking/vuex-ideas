import { createApp, ComponentOptions } from 'vue'
import { Vuex } from 'src/index'

export function mount(vuex: Vuex, component: ComponentOptions) {
  const el = createElement()

  component.render = () => {}

  const app = createApp(component)

  app.use(vuex)

  return app.mount(el)
}

function createElement() {
  const el = document.createElement('div')

  document.body.appendChild(el)

  return el
}
