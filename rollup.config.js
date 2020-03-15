import ts from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const banner =
`/*!
 * vuex v${pkg.version}
 * (c) ${new Date().getFullYear()} Evan You
 * @license MIT
 */`

const configs = [
  { input: 'src/index.ts', file: 'dist/vuex.esm.js', format: 'es', browser: true, env: 'development' },
  { input: 'src/index.ts', file: 'dist/vuex.esm.prod.js', format: 'es', browser: true, env: 'production' },
  { input: 'src/index.ts', file: 'dist/vuex.esm-bundler.js', format: 'es', env: 'development' },
  { input: 'src/index.ts', file: 'dist/vuex.global.js', format: 'iife', env: 'development' },
  { input: 'src/index.ts', file: 'dist/vuex.global.prod.js', format: 'iife', minify: true, env: 'production' },
  { input: 'src/index.ts', file: 'dist/vuex.cjs.js', format: 'cjs', env: 'development' }
]

function createEntries() {
  return configs.map(c => createEntry(c))
}

function createEntry(config) {
  const c = {
    external: ['vue'],
    input: config.input,
    plugins: [],
    output: {
      banner,
      file: config.file,
      format: config.format,
      globals: {
        vue: 'Vue'
      }
    }
  }

  if (config.format === 'iife') {
    c.output.name = 'Vuex'
  }

  c.plugins.push(ts({
    check: config.format === 'es' && config.browser && config.env === 'development',
    tsconfigOverride: {
      compilerOptions: {
        declaration: config.format === 'es' && config.browser && config.env === 'development',
        target: config.format === 'iife' || config.format === 'cjs' ? 'es5' : 'esnext'
      },
      exclude: ['__tests__']
    }
  }))

  if (config.minify) {
    c.plugins.push(terser({ module: config.format === 'es' }))
  }

  return c
}

export default createEntries()
