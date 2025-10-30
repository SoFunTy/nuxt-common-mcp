import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'

describe('MCP Module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
    server: true
  })

  it('should load module configuration', async () => {
    const config = await $fetch('/api/test')
    expect(config).toHaveProperty('mcp')
    expect(config.mcp).toHaveProperty('enabled', true)
  })

  it('should have MCP client available', async () => {
    // Test client-side functionality
    const clientExists = await $fetch('/api/test/client')
    expect(clientExists).toBe(true)
  })
})