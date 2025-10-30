<template>
  <div>
    <h1>Nuxt MCP Module Playground</h1>
    <div v-if="mcpLoaded">
      ✅ MCP Module loaded successfully!
    </div>
    <div v-else>
      ❌ MCP Module not loaded
    </div>
  </div>
</template>

<script setup lang="ts">
const { $common } = useNuxtApp()
const mcpLoaded = computed(() => !!$common?.mcp_cli)

// Test MCP functionality
onMounted(async () => {
  if ($common?.mcp_cli) {
    try {
      const tools = await $common.mcp_cli.listTools()
      console.log('Available MCP tools:', tools)
    } catch (error) {
      console.error('MCP client error:', error)
    }
  }
})
</script>