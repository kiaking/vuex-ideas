import { createModule } from '../../src'
import greeter from './greeter'

const counter = createModule({
  name: 'counter',

  use: () => ({ greeter }),

  state: () => ({
    count: 1,
    name: 'Counter'
  }),

  getters: {
    double(): number {
      return this.state.count * 2
    },

    fullName(): string {
      return `Mr. ${this.state.name}`
    },

    countWithGreet(): string {
      // Dependencies are not typable at the moment.
      return `${(this as any).greeter.state.greet}, ${this.state.count}`
    }
  },

  actions: {
    increment(): void {
      this.state.count++
    },

    incrementDouble(): void {
      this.increment()
      this.increment()
    }
  }
})

export default counter
