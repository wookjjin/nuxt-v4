export interface ServiceRouteConfig {
  /** 서비스 폴더명 */
  folderName: string,
  /** 라우트 변환 방식 */
  mode: 'remove' | 'prefix' | 'custom',
  /** prefix 모드일 때 사용할 접두사 */
  prefix?: string,
  /** custom 모드일 때 사용할 변환 함수 */
  transform?: (path: string) => string,
  /** 특정 파일만 적용할 조건 (파일명 기준) */
  include?: string[],
  /** 제외할 파일들 (파일명 기준) */
  exclude?: string[],
  /** 활성화 여부 */
  enabled?: boolean,
  /** 설명 (로깅용) */
  description?: string,
}

export const serviceRouteConfigs: ServiceRouteConfig[] = [
  // 인증 관련 - 폴더명 완전 제거
  {
    folderName: 'authentication',
    mode: 'remove',
    description: '인증 페이지들을 루트로 이동',
    enabled: true
  },

  // 관리자 페이지 - admin- 접두사 추가
  {
    folderName: 'admin',
    mode: 'prefix',
    prefix: 'admin-',
    description: '관리자 페이지에 admin- 접두사 추가',
    enabled: true
  },

  // 사용자 관리 - user- 접두사 추가
  {
    folderName: 'user-management',
    mode: 'prefix',
    prefix: 'user-',
    description: '사용자 관리 페이지에 user- 접두사 추가',
    enabled: true
  },

  // 커머스 관련 - 폴더명 제거 (특정 파일만)
  {
    folderName: 'commerce',
    mode: 'remove',
    include: ['products', 'cart', 'checkout', 'orders', 'categories', 'search', 'wishlist'],
    exclude: ['internal', 'debug'],
    description: '주요 커머스 페이지들을 루트로 이동',
    enabled: true
  },

  // 결제 관련 - pay- 접두사
  {
    folderName: 'payment',
    mode: 'prefix',
    prefix: 'pay-',
    description: '결제 페이지에 pay- 접두사 추가',
    enabled: true
  },

  // 고객지원 - 커스텀 변환 (help 폴더로)
  {
    folderName: 'customer-support',
    mode: 'custom',
    transform: (path) => path.replace('/customer-support/', '/help/'),
    description: '고객지원 페이지를 /help 경로로 변경',
    enabled: true
  },

  // 분석/통계 - 폴더명 제거하고 특정 파일만
  {
    folderName: 'analytics',
    mode: 'remove',
    include: ['dashboard', 'reports', 'insights'],
    exclude: ['internal-stats', 'raw-data'],
    description: '주요 분석 페이지들을 루트로 이동',
    enabled: true
  },

  // API 문서 - docs- 접두사 (개발환경에서만)
  {
    folderName: 'api-docs',
    mode: 'prefix',
    prefix: 'docs-',
    description: 'API 문서 페이지에 docs- 접두사 추가',
    enabled: process.env.NODE_ENV === 'development'
  },

  // 블로그 - 폴더명 제거
  {
    folderName: 'blog',
    mode: 'remove',
    exclude: ['draft', 'private'],
    description: '블로그 페이지들을 루트로 이동',
    enabled: true
  },

  // 마케팅 - marketing- 접두사
  {
    folderName: 'marketing',
    mode: 'prefix',
    prefix: 'promo-',
    description: '마케팅 페이지에 promo- 접두사 추가',
    enabled: true
  }
]

/**
 * 단일 서비스 라우트 변환
 */
export function transformServiceRoute(
  config: ServiceRouteConfig,
  path: string,
  fileName: string
): string | null {
  const folderPattern = `/${config.folderName}/`

  // 해당 서비스 폴더가 아니면 변환하지 않음
  if (!path.includes(folderPattern)) {
    return null
  }

  // 비활성화된 설정은 건너뛰기
  if (config.enabled === false) {
    return null
  }

  // include 조건 확인 (파일명 및 폴더 경로 기준)
  if (config.include && config.include.length > 0) {
    const isIncluded = config.include.some(includePath => {
      // 파일명이 직접 매치되는 경우
      if (fileName.includes(includePath)) {
        return true
      }

      // 경로에 포함되는 경우 (단일 파일)
      if (path.includes(`/${includePath}.`)) {
        return true
      }

      // 폴더 경로에 포함되는 경우
      if (path.includes(`/${includePath}/`)) {
        return true
      }

      // 폴더 내부의 파일들을 처리하는 경우
      // 예: /commerce/categories/index.vue -> categories 매치
      const pathSegments = path.split('/').filter(Boolean)
      const folderIndex = pathSegments.indexOf(config.folderName)
      if (folderIndex !== -1 && folderIndex + 1 < pathSegments.length) {
        const nextSegment = pathSegments[folderIndex + 1]
        if (nextSegment === includePath) {
          return true
        }
      }

      return false
    })

    if (!isIncluded) {
      return null
    }
  }

  // exclude 조건 확인 (파일명 및 폴더 경로 기준)
  if (config.exclude && config.exclude.length > 0) {
    const isExcluded = config.exclude.some(excludePath => {
      // 파일명이 직접 매치되는 경우
      if (fileName.includes(excludePath)) {
        return true
      }

      // 경로에 포함되는 경우 (단일 파일)
      if (path.includes(`/${excludePath}.`)) {
        return true
      }

      // 폴더 경로에 포함되는 경우
      if (path.includes(`/${excludePath}/`)) {
        return true
      }

      // 폴더 내부의 파일들을 처리하는 경우
      const pathSegments = path.split('/').filter(Boolean)
      const folderIndex = pathSegments.indexOf(config.folderName)
      if (folderIndex !== -1 && folderIndex + 1 < pathSegments.length) {
        const nextSegment = pathSegments[folderIndex + 1]
        if (nextSegment === excludePath) {
          return true
        }
      }

      return false
    })

    if (isExcluded) {
      return null
    }
  }

  // 변환 모드에 따라 처리
  switch (config.mode) {
    case 'remove':
      return path.replace(folderPattern, '/')

    case 'prefix':
      if (!config.prefix) return path
      const newPath = path.replace(folderPattern, '/')
      const pathSegments = newPath.split('/').filter(Boolean)
      if (pathSegments.length > 0) {
        pathSegments[0] = `${config.prefix}${pathSegments[0]}`
        return `/${pathSegments.join('/')}`
      }
      return newPath

    case 'custom':
      return config.transform ? config.transform(path) : path

    default:
      return path
  }
}

/**
 * 모든 서비스 라우트 변환 적용
 */
export function applyAllServiceRoutes(pages: any[]) {
  const routeChanges: Array<{
    original: string,
    transformed: string,
    service: string,
    file: string,
    description?: string,
  }> = []

  pages.forEach(page => {
    if (!page.path || !page.file) return

    const fileName = page.file.split('/').pop()?.replace('.vue', '') || ''
    let transformedPath = page.path
    let appliedService = ''
    let appliedDescription = ''

    // 각 서비스 설정을 순서대로 적용 (첫 번째 매치만 적용)
    for (const config of serviceRouteConfigs) {
      const result = transformServiceRoute(config, page.path, fileName)
      if (result && result !== page.path) {
        transformedPath = result
        appliedService = config.folderName
        appliedDescription = config.description || ''
        break // 첫 번째 매치만 적용
      }
    }

    // 변경사항이 있으면 적용
    if (transformedPath !== page.path) {
      routeChanges.push({
        original: page.path,
        transformed: transformedPath,
        service: appliedService,
        file: page.file,
        description: appliedDescription
      })

      // 원본 경로 정보 보존
      page.originalPath = page.path
      page.service = appliedService

      // 실제 변환 적용
      page.path = transformedPath
      page.name = generateRouteName(transformedPath)
    }
  })

  return routeChanges
}

/**
 * 라우트 이름 생성 헬퍼
 */
function generateRouteName(path: string): string {
  return path
    .split('/')
    .filter(Boolean)
    .join('-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

/**
 * 중복 라우트 체크
 */
export function checkDuplicateRoutes(pages: any[]) {
  const pathCounts = new Map<string, Array<{ file: string, service?: string }>>()

  pages.forEach(page => {
    if (page.path) {
      const entries = pathCounts.get(page.path) || []
      entries.push({
        file: page.file || 'unknown',
        service: page.service
      })
      pathCounts.set(page.path, entries)
    }
  })

  const duplicates = Array.from(pathCounts.entries()).filter(([, files]) => files.length > 1)

  if (duplicates.length > 0) {
    console.warn('\n⚠️  Duplicate routes detected:')
    console.warn('━'.repeat(60))
    duplicates.forEach(([path, files]) => {
      console.warn(`\n❌ ${path}:`)
      files.forEach(({ file, service }) => {
        const serviceInfo = service ? ` (service: ${service})` : ''
        console.warn(`   📄 ${file}${serviceInfo}`)
      })
    })
    console.warn('\n💡 Consider adjusting your route configurations to avoid conflicts.\n')

    return duplicates
  }

  return []
}

/**
 * 라우트 변환 결과 로깅
 */
export function logRouteTransformations(routeChanges: ReturnType<typeof applyAllServiceRoutes>) {
  if (routeChanges.length === 0) {
    console.log('\n✅ No route transformations needed.\n')
    return
  }

  console.log('\n🔄 Service Routes Transformation Summary')
  console.log('━'.repeat(80))

  // 서비스별로 그룹핑
  const groupedChanges = routeChanges.reduce((acc, change) => {
    if (!acc[change.service]) {
      acc[change.service] = []
    }
    acc[change.service]?.push(change)
    return acc
  }, {} as Record<string, typeof routeChanges>)

  // 서비스별 출력
  Object.entries(groupedChanges).forEach(([service, changes], _index) => {
    const config = serviceRouteConfigs.find(c => c.folderName === service)
    const description = config?.description || ''

    console.log(`\n📁 ${service.toUpperCase()}${description ? ` - ${description}` : ''}`)
    console.log('   ' + '─'.repeat(50))

    changes.forEach(change => {
      console.log(`   ${change.original} → ${change.transformed}`)
    })
  })

  // 요약
  console.log('\n📊 Summary:')
  console.log(`   • Total services processed: ${Object.keys(groupedChanges).length}`)
  console.log(`   • Total routes transformed: ${routeChanges.length}`)
  console.log(`   • Configurations active: ${serviceRouteConfigs.filter(c => c.enabled !== false).length}`)
  console.log('')
}

// 타입 정의
export interface TransformedPage {
  path: string,
  name?: string,
  file: string,
  originalPath?: string,
  service?: string,
}