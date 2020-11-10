import path from 'path'
import { UserConfig } from 'vite'

const config: UserConfig = {
  alias: {
    '/@vuex/': path.resolve(__dirname, '../../../src')
  }
}

export default config
