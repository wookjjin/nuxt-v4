import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'

// 파일명을 kebab-case로 변환하는 함수
function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase()
}

/**
 * 폴더 구조를 무시하고, 각 .vue 파일의 파일명만을 사용하여
 * kebab-case로 변환한 경로로 페이지를 등록합니다.
 * @param dir - 스캔할 디렉토리 경로
 * @param pages - Nuxt Page Array
 */
export function scanAndRegisterPages(dir: string, pages: any[]) {
  try {
    if (!statSync(dir).isDirectory()) return
  } catch {
    return
  }

  for (const file of readdirSync(dir)) {
    const filePath = resolve(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      // 폴더 내부도 계속 순회
      scanAndRegisterPages(filePath, pages)
    } else if (file.endsWith('.vue')) {
      const fileName = file.replace('.vue', '')
      let path = ''
      if (fileName.toLowerCase() === 'index') {
        path = '/'
      } else {
        path = '/' + toKebabCase(fileName)
      }
      pages.push({
        name: (path === '/' ? 'index' : path.replace(/[/:]/g, '-')),
        path: path,
        file: filePath
      })
    }
  }
}