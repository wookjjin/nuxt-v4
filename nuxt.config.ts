// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'

import { scanAndRegisterPages } from './app/shared/utils/pageScanner'

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

  srcDir: '.',
  dir: {
    app: 'app'
  },

  // Modules 디렉토리의 페이지들을 자동으로 등록
  hooks: {
    'pages:extend'(pages) {
      // 자동 생성된 페이지를 모두 제거하고, 아래 로직으로만 페이지를 등록합니다.
      pages.splice(0, pages.length)

      const modulesDir = resolve('./app/modules')
      try {
        if (!statSync(modulesDir).isDirectory()) return

        // 각 module 디렉토리의 pages 폴더를 스캔합니다.
        for (const domain of readdirSync(modulesDir)) {
          const domainPath = resolve(modulesDir, domain)
          if (statSync(domainPath).isDirectory()) {
            const pagesDir = resolve(domainPath, 'pages')
            scanAndRegisterPages(pagesDir, pages)
          }
        }
      } catch {
        // modules 디렉토리가 존재하지 않는 경우 무시합니다.
      }
    }
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
  }
})