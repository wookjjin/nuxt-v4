import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'

/**
 * Creates a page route by recursively scanning the .vue
 * file from the specified directory.
 * @param dir - Directory path to scan
 * @param pages - Nuxt Page Array
 * @param routePrefix - Prefix of the route path to be created
 */
export function scanAndRegisterPages(dir: string, pages: any[], routePrefix = '') {
  try {
    if (!statSync(dir).isDirectory()) return
  } catch {
    return
  }

  for (const file of readdirSync(dir)) {
    const filePath = resolve(dir, file)
    const stat = statSync(filePath)
    const fileAndPrefix = `${routePrefix}${file}`

    if (stat.isDirectory()) {
      scanAndRegisterPages(filePath, pages, `${fileAndPrefix}/`)
    } else if (file.endsWith('.vue')) {
      const fileName = file.replace('.vue', '')
      let path = `${routePrefix}${fileName}`

      if (fileName.toLowerCase() === 'index') {
        path = routePrefix.slice(0, -1)
      }

      path = `/${path}`.replace(/\/+/g, '/')

      pages.push({
        name: path.replace(/[/:]/g, '-') || 'index',
        path: path.replace(/\[([^\]]+)\]/g, ':$1'),
        file: filePath
      })
    }
  }
}