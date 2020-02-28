import { createModule } from '../../src'
import counter from './counter'

const greeter = createModule({
  name: 'greeter',

  use: () => ({ counter }),

  state: () => ({
    greet: 'Hello!'
  }),

  getters: {
    fullGreet(): string {
      return `${this.state.greet} Kia!`
    }
  },

  actions: {
    changeGreet(): void {
      this.state.greet = 'YO!'
    }
  }
})

export default greeter
