import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

const client = new Client({
    name: 'mcp-client',
    version: '1.0.0'
})

let transport: StreamableHTTPClientTransport | null = null
let is_connect = false


export default defineNuxtPlugin((nuxtApp: any) => {
    const config = nuxtApp.$config.public.common
    if (!config.enabled) {
        return
    }

    if (!is_connect) {
        const mcpEndpoint = `${config.baseURL}${config.apiPrefix}/mcp`
        transport = new StreamableHTTPClientTransport(new URL(mcpEndpoint))
        client.connect(transport).then(() => {
            is_connect = true
        })
    }
    return {
        provide: {
            common: {
                version: '1.0.0',
                name: 'mcp client',
                mcp_cli: client
            }
        }
    }
})