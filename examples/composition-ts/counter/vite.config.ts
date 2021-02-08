import path from 'path'
import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const config: UserConfig = {
  plugins: [vue()],

  alias: {
    '/@vuex/': path.resolve(__dirname, '../../../src')
  }
}

export default config
