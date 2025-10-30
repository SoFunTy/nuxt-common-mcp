import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/module'
  ],
  externals: [
    '@nuxt/kit',
    '@nuxt/schema',
    'nuxt',
    'vue',
    '#app',
    '#imports',
    '#components'
  ],
  rollup: {
    esbuild: {
      target: 'esnext'
    },
    emitCJS: true,
    inlineDependencies: true,
  },
  declaration: true,
  clean: true
})