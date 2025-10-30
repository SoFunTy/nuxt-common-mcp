import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module'],
  common: {
    enabled: true,
    apiPrefix: '/api/common',
    baseURL: 'http://localhost:3000',
  },
  devtools: {
    enabled: true
  }
})