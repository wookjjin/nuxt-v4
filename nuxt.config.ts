// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

import {
  applyAllServiceRoutes,
  checkDuplicateRoutes,
  logRouteTransformations
} from './app/shared/config/route-mapping'

export default defineNuxtConfig({
  compatibilityDate: '2025-06-24',
  future: {
    compatibilityVersion: 4
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/fonts'
  ],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  experimental: {
    scanPageMeta: 'after-resolve',
    sharedPrerenderData: false,
    compileTemplate: true,
    resetAsyncDataToUndefined: true,
    templateUtils: true,
    relativeWatchPaths: true,
    normalizeComponentNames: false,
    spaLoadingTemplateLocation: 'within',
    parseErrorData: false,
    pendingWhenIdle: true,
    alwaysRunFetchOnKeyChange: true,
    defaults: {
      useAsyncData: {
        deep: true
      }
    }
  },
  features: {
    inlineStyles: true
  },
  unhead: {
    renderSSRHeadOptions: {
      omitLineBreaks: false
    }
  },
  hooks: {
    'pages:extend'(pages) {
      // 서비스 라우트 변환 적용
      const routeChanges = applyAllServiceRoutes(pages)

      // 개발 환경에서만 상세 로깅
      if (process.env.NODE_ENV === 'development') {
        // 변환 결과 로깅
        logRouteTransformations(routeChanges)

        // 중복 라우트 체크
        const duplicates = checkDuplicateRoutes(pages)

        // 중복이 있으면 프로세스 종료 (선택사항)
        if (duplicates.length > 0 && process.env.STRICT_ROUTING === 'true') {
          console.error('❌ Duplicate routes found. Fix conflicts before continuing.')
          process.exit(1)
        }
      }

      // 프로덕션에서는 간단한 요약만
      if (process.env.NODE_ENV === 'production' && routeChanges.length > 0) {
        console.log(`✅ ${routeChanges.length} service routes transformed successfully.`)
      }
    },

    // 빌드 완료 후 라우트 정보 출력 (선택사항)
    'build:done'() {
      if (process.env.NODE_ENV === 'development' && process.env.SHOW_ROUTES === 'true') {
        console.log('\n📋 All available routes have been generated.')
        console.log('   Check your browser network tab to see the actual routes in action.')
      }
    }
  }
})