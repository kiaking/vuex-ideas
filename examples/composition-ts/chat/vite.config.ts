import path from 'path'
import { UserConfig } from 'vite'

const config: UserConfig = {
  alias: {
    '/@/': path.resolve(__dirname, './src'),
    '/@vuex/': path.resolve(__dirname, '../../../src')
  }
}

export default config
