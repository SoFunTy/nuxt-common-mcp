import os from 'os'
import { readFileSync } from 'fs'
import checkDiskSpace from 'check-disk-space'

mcp_server.registerTool('get_system_info', {}, async () => {
  // 获取系统信息
  const systemInfo = {
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    uptime: os.uptime(),
    totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024), // GB
    freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024), // GB
    usedMemory: Math.round((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024), // GB
    cpus: os.cpus().length,
    loadAverage: os.loadavg(),
    nodeVersion: process.version,
    npmVersion: process.env.npm_version || 'unknown'
  }

  // 获取进程信息
  const processInfo = {
    pid: process.pid,
    ppid: process.ppid,
    memoryUsage: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024), // MB
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // MB
      external: Math.round(process.memoryUsage().external / 1024 / 1024) // MB
    },
    cpuUsage: process.cpuUsage(),
    uptime: process.uptime()
  }

  // 获取环境变量信息
  const envKeys = ['NODE_ENV', 'PATH', 'HOME', 'USER', 'PWD', 'LOGNAME']
  const envInfo: Record<string, string> = {}
  for (const key of envKeys) {
    envInfo[key] = process.env[key] || 'undefined'
  }

  // 获取网络信息
  const networkInterfaces = os.networkInterfaces()

  // 获取文件系统信息
  let fsData: any = { error: '文件系统信息获取失败' }
  try {
    const platform = os.platform()
    
    if (platform === 'linux' || platform === 'win32') {
      // 使用 diskusage 获取实际磁盘使用情况
      const rootPath = platform === 'win32' ? 'C:\\' : '/'
      const diskInfo = await checkDiskSpace(rootPath)
      
      const totalGB = Math.round(diskInfo.size / (1024 * 1024 * 1024))
      const freeGB = Math.round(diskInfo.free / (1024 * 1024 * 1024))
      const usedGB = totalGB - freeGB
      
      fsData = {
        platform,
        root: {
          path: rootPath,
          total: diskInfo.size,
          free: diskInfo.free,
          used: diskInfo.size - diskInfo.free, // 计算已用空间
          totalGB,
          freeGB,
          usedGB,
          usagePercent: Math.round((usedGB / totalGB) * 100),
          filesystemType: platform === 'win32' ? 'NTFS' : 'unknown'
        }
      }
      
      if (platform === 'linux') {
        // 添加挂载点信息
        try {
          const mountsData = readFileSync('/proc/mounts', 'utf8')
          const mounts = mountsData.split('\n')
            .filter((line: string) => line && !line.startsWith('#'))
            .map((line: string) => {
              const parts = line.split(' ')
              if (parts.length >= 3) {
                const [device, mountpoint, fstype, options] = parts
                return {
                  device,
                  mountpoint,
                  fstype,
                  options
                }
              }
              return null
            })
            .filter(Boolean)
          
          fsData.mounts = mounts
        } catch {
          fsData.mountsError = '无法获取挂载点信息'
        }
      }
    } else if (platform === 'darwin') { // macOS
      try {
        const rootPath = '/'
        const diskInfo = await checkDiskSpace(rootPath)
        
        const totalGB = Math.round(diskInfo.size / (1024 * 1024 * 1024))
        const freeGB = Math.round(diskInfo.free / (1024 * 1024 * 1024))
        const usedGB = totalGB - freeGB
        
        fsData = {
          platform,
          root: {
            path: rootPath,
            total: diskInfo.size,
            free: diskInfo.free,
            used: diskInfo.size - diskInfo.free, // 计算已用空间
            totalGB,
            freeGB,
            usedGB,
            usagePercent: Math.round((usedGB / totalGB) * 100),
            filesystemType: 'APFS'
          }
        }
      } catch (e) {
        fsData = { error: 'macOS 磁盘信息获取失败（权限问题）' }
      }
    } else {
      fsData = { error: `平台 ${platform} 不支持磁盘信息获取` }
    }
  } catch (e) {
    fsData = { error: '文件系统信息获取失败（可能需要权限）' }
  }

  // 构建结构化数据
  const systemData = {
    timestamp: new Date().toISOString(),
    system: {
      platform: systemInfo.platform,
      arch: systemInfo.arch,
      hostname: systemInfo.hostname,
      uptime: Math.round(systemInfo.uptime),
      totalMemory: systemInfo.totalMemory,
      freeMemory: systemInfo.freeMemory,
      usedMemory: systemInfo.usedMemory,
      memoryUsagePercent: Math.round((systemInfo.usedMemory / systemInfo.totalMemory) * 100),
      cpus: systemInfo.cpus,
      loadAverage: systemInfo.loadAverage.map(v => Number(v.toFixed(2))),
      nodeVersion: systemInfo.nodeVersion,
      npmVersion: systemInfo.npmVersion
    },
    process: {
      pid: processInfo.pid,
      ppid: processInfo.ppid,
      memoryUsage: processInfo.memoryUsage,
      cpuUsage: {
        user: Math.round(processInfo.cpuUsage.user / 1000),
        system: Math.round(processInfo.cpuUsage.system / 1000)
      },
      uptime: Math.round(processInfo.uptime)
    },
    environment: envInfo,
    network: Object.fromEntries(Object.entries(networkInterfaces).map(([name, interfaces]) => [
      name,
      interfaces?.map(iface => ({
        address: iface.address,
        family: iface.family,
        mac: iface.mac,
        internal: iface.internal
      })) || []
    ])),
    filesystem: fsData
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(systemData, null, 2)
      }
    ],
    structuredContent: systemData
  }
})