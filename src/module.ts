import { defineNuxtModule, createResolver, addImportsDir, addPlugin, addServerPlugin, addServerImportsDir } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
    /**
     * Whether to enable the MCP module
     * @default true
     */
    enabled?: boolean
    /**
     * API prefix for MCP endpoints
     * @default '/api/common'
     */
    apiPrefix?: string
    baseURL?: string
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'common',
        configKey: 'common',
        version: '1.0.0',
        compatibility: {
            nuxt: '^4.0.0'
        }
    },

    // Default configuration options of the Nuxt module
    defaults: {
        enabled: true,
        apiPrefix: '/api/common',
        baseURL: 'http://localhost:3000'
    },

    setup(options, nuxt) {
        // Check if module is enabled
        if (!options.enabled) {
            console.log('ℹ️ MCP module is disabled')
            return
        }

        const { resolve } = createResolver(import.meta.url)

        // For published packages, we need to resolve to the package root
        const runtimePath = resolve('../runtime')

        addServerImportsDir(resolve(runtimePath, './utils'))
        addImportsDir(resolve(runtimePath, './skills'))

        addPlugin({
            src: resolve(runtimePath, './plugins/mcp_client'),
            mode: 'client'
        })

        addServerPlugin(resolve(runtimePath, './plugins/skill_auto_import'))


        nuxt.hook('nitro:config', nitroConfig => {
            if (!nitroConfig.handlers) {
                nitroConfig.handlers = []
            }
            nitroConfig.handlers.push({
                route: `${options.apiPrefix}/mcp`,
                handler: resolve(runtimePath, './api/mcp')
            })
        })

        nuxt.options.runtimeConfig.__dirname = resolve('..')
        nuxt.options.runtimeConfig.public.common = {
            enabled: options.enabled,
            apiPrefix: options.apiPrefix || '/api/mcp',
            client: true,
            baseURL: options.baseURL || 'http://localhost:3000'
        }

        console.log(`✅ MCP module loaded (enabled: ${options.enabled}, apiPrefix: "${options.apiPrefix}")`)
    }
})

declare module '@nuxt/schema' {
    interface RuntimeConfig {
        common?: {
            enabled: boolean
            apiPrefix: string
            baseURL: string
        }
    }
}
