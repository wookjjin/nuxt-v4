import stylistic from '@stylistic/eslint-plugin'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // your custom flat configs go here, for example:
  {
    files: ['**/*.vue'],
    rules: {
      'vue/html-self-closing': 'warn',
      'vue/block-order': [
        'error', {
          order: ['script', 'template', 'style']
        }
      ],
      'vue/no-required-prop-with-default': 'off',
      'vue/require-prop-types': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-indent': ['error', 2, {
        baseIndent: 1,
        alignAttributesVertically: true
      }],
      'vue/no-multi-spaces': ['error', {
        ignoreProperties: false
      }],
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-unused-refs': 'error',
      'vue/require-default-prop': 'error',
      'vue/no-v-html': 'warn',
      'vue/order-in-components': ['error', {
        order: [
          'el',
          'name',
          'key',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['components', 'directives', 'filters'],
          'extends',
          'mixins',
          ['provide', 'inject'],
          'ROUTER_GUARDS',
          'layout',
          'middleware',
          'validate',
          'scrollToTop',
          'transition',
          'loading',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'emits',
          'setup',
          'asyncData',
          'data',
          'fetch',
          'head',
          'computed',
          'watch',
          'watchQuery',
          'methods',
          ['template', 'render'],
          'renderError'
        ]
      }]
    }
  },
  {
    rules: {
      'no-console': 'off', // 콘솔 로그 경고로 변경
      '@typescript-eslint/no-explicit-any': 'off', // any 사용에 대한 경고
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }], // 사용하지 않는 변수에 대한 처리 개선
      'complexity': ['warn', 10], // 함수 복잡도 제한
      'import/no-duplicates': 'error',
      // 추가된 import 관련 규칙들
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'type'  // 'type' 그룹을 별도로 추가
        ],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true
        },
        'pathGroups': [
          {
            pattern: '~/**',
            group: 'internal',
            position: 'after'
          }
        ],
        'pathGroupsExcludedImportTypes': ['type']
      }],
      'import/newline-after-import': 'error'
    }
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/member-delimiter-style': ['error',
        {
          multiline: {
            delimiter: 'comma',
            requireLast: true
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false
          },
          multilineDetection: 'brackets'
        }
      ],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/brace-style': 'error',
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/template-curly-spacing': 'error'
    }
  }
)