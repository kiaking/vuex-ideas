import { createModule } from '../../src'

interface State {
  count: number
}

const counter = createModule<State>({
  state() {
    return {
      count: 1
    }
  },

  actions: {
    increment (state) {
      state.count++
    }
  }
})

export default counter
