# @blodless/common

A comprehensive Nuxt 4 module that provides MCP (Model Context Protocol) integration and common utilities for AI-powered applications.

## Features

- **MCP Integration**: Full Model Context Protocol support with JSON-RPC 2.0 compliance
- **Configurable API**: Flexible API endpoint configuration
- **Client-Server Architecture**: Streamable HTTP transport for MCP communication
- **Skill System**: Built-in utility skills for common operations
- **Type Safety**: Full TypeScript support throughout
- **Runtime Config**: Seamless integration with Nuxt's runtime configuration

## Installation

```bash
npm install @blodless/common
# or
pnpm add @blodless/common
# or
yarn add @blodless/common
```

## Usage

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@blodless/common'],

  // Configuration options
  common: {
    enabled: true,           // Enable/disable the module
    apiPrefix: '/api/common', // Custom API prefix
    baseURL: 'http://localhost:3000' // Base URL for client
  }
})
```

## Configuration

The module supports the following configuration options:

- `enabled` (boolean, default: `true`) - Enable/disable the entire module
- `apiPrefix` (string, default: `'/api/common'`) - API endpoint prefix
- `baseURL` (string, default: `'http://localhost:3000'`) - Base URL for client-side usage

## Available Endpoints

- `POST /api/common/mcp` - MCP protocol endpoint for JSON-RPC 2.0 requests

## Built-in Skills

The module includes several built-in skills for common operations:

- **echo**: Test skill that echoes input parameters
- **time**: Get current time in multiple formats
- **system-info**: Get basic system information

## Environment Variables

You can configure the module using environment variables:

```bash
# Module configuration
COMMON_ENABLED=true
COMMON_API_PREFIX=/api/common
COMMON_BASE_URL=http://localhost:3000
```

## Development

```bash
# Install dependencies
pnpm install

# Run development mode
pnpm dev

# Build for production
pnpm build:pack

# Run tests
pnpm test

# Lint code
pnpm lint

# Type checking
pnpm type-check
```

## License

MIT License © [blodless](https://github.com/blodless)