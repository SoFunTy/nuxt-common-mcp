// 全局类型声明
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

declare global {
  const mcp_server: McpServer
  const z: typeof import('zod')
  const _: any
  const moment: any
  const uuid_v7: any
}

export {}