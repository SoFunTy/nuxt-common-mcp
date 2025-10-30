import { mcp_server as server } from '../utils/mcp'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamablehttp.js'

let transport: StreamableHTTPServerTransport | null = null

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'OPTIONS') {
    setHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, mcp-protocol-version',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    })
    return ''
  }

  if (method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  // Lazy initialization
  if (!server || !transport) {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      // enableJsonResponse: true
    })
    await server.connect(transport)
  }

  const body = await readBody(event)

  setHeader(event, 'Content-Type', 'application/json')
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Headers', '*')

  // Fix Accept header for MCP Inspector
  const currentAccept = getHeader(event, 'accept')
  event.node.req.headers.accept = currentAccept ? `${currentAccept}, text/event-stream` : 'text/event-stream'

  try {
    // transport 处理请求并直接写入响应
    await transport!.handleRequest(event.node.req, event.node.res, body)
    // 由于 transport 直接处理响应，这里不需要返回任何内容
  } catch (error: any) {
    console.error('MCP Transport Error:', error)
    // 如果 transport 处理失败，返回错误响应
    return {
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: `MCP Server Error: ${error.message}`
      },
      id: body?.id || null
    }
  }
})