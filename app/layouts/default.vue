<script setup>
// 반응형 상태 관리
const showSearch = ref(false)
const showMenu = ref(false)
const searchQuery = ref('')
const cartCount = ref(3) // 예시 데이터

// 메서드
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    nextTick(() => {
      document.querySelector('input[type="text"]')?.focus()
    })
  }
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    showSearch.value = false
    searchQuery.value = ''
  }
}

// 메뉴 오버레이 ESC 키로 닫기
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      if (showMenu.value) toggleMenu()
      if (showSearch.value) toggleSearch()
    }
  }
  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// 메뉴 클릭 시 닫기
function handleMenuClick() {
  showMenu.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-md mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- 로고/홈 버튼 -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">M</span>
            </div>
            <span class="font-bold text-lg text-gray-900">MiniShop</span>
          </NuxtLink>

          <!-- 우측 액션 버튼들 -->
          <div class="flex items-center space-x-3">
            <!-- 검색 버튼 -->
            <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" @click="toggleSearch">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <!-- 장바구니 버튼 -->
            <NuxtLink to="/cart" class="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19a1 1 0 100 2 1 1 0 000-2zM20 19a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              <span
                v-if="cartCount > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {{ cartCount }}
              </span>
            </NuxtLink>

            <!-- 메뉴 버튼 -->
            <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer" @click="toggleMenu">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 검색바 (토글시 표시) -->
        <div v-show="showSearch" class="mt-3">
          <div class="relative">
            <input
              v-model="searchQuery" type="text" placeholder="상품을 검색해보세요..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="handleSearch">
            <svg
              class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>

    <!-- 모바일/태블릿: 오버레이 메뉴 -->
    <transition name="slide-fade">
      <div v-if="showMenu" class="fixed inset-0 z-[9999] lg:hidden">
        <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300" @click="toggleMenu"/>
        <div
          class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          :class="showMenu ? 'translate-x-0' : 'translate-x-full'" @click.stop>
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">메뉴</h2>
              <button class="p-2 rounded-full hover:bg-gray-100" @click="toggleMenu">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <nav class="p-4">
            <ul class="space-y-3">
              <li>
                <NuxtLink to="/categories" class="block py-2 text-gray-700 hover:text-blue-600" @click="handleMenuClick">
                  카테고리
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/orders" class="block py-2 text-gray-700 hover:text-blue-600" @click="handleMenuClick">
                  주문내역
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/wishlist" class="block py-2 text-gray-700 hover:text-blue-600" @click="handleMenuClick">
                  찜한상품
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/profile" class="block py-2 text-gray-700 hover:text-blue-600" @click="handleMenuClick">
                  마이페이지
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/help/contact" class="block py-2 text-gray-700 hover:text-blue-600" @click="handleMenuClick">
                  고객지원
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </transition>
    <!-- 데스크탑: 토글되는 사이드바 -->
    <transition name="slide-fade">
      <div
        v-if="showMenu" class="hidden lg:block fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-[9999] transform transition-transform duration-300 ease-in-out"
        :class="showMenu ? 'translate-x-0' : 'translate-x-full'" @click.stop>
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">메뉴</h2>
            <button class="p-2 rounded-full hover:bg-gray-100" @click="toggleMenu">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <nav class="p-4">
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/categories" class="block py-2 text-gray-700 hover:text-blue-600" @click="handleMenuClick">
                카테고리
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/orders" class="block py-2 text-gray-700 hover:text-blue-600" @click="handleMenuClick">
                주문내역
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/wishlist" class="block py-2 text-gray-700 hover:text-blue-600" @click="handleMenuClick">
                찜한상품
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/profile" class="block py-2 text-gray-700 hover:text-blue-600" @click="handleMenuClick">
                마이페이지
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/help/contact" class="block py-2 text-gray-700 hover:text-blue-600" @click="handleMenuClick">
                고객지원
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </transition>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 max-w-md mx-auto w-full pb-20">
      <slot />
    </main>

    <!-- 하단 네비게이션 -->
    <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div class="max-w-md mx-auto px-4">
        <div class="flex items-center justify-around py-2">
          <NuxtLink
            to="/" class="flex flex-col items-center py-2 px-3 text-xs"
            :class="$route.path === '/' ? 'text-blue-600' : 'text-gray-600'">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            홈
          </NuxtLink>

          <NuxtLink
            to="/categories" class="flex flex-col items-center py-2 px-3 text-xs"
            :class="$route.path.startsWith('/categories') ? 'text-blue-600' : 'text-gray-600'">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            카테고리
          </NuxtLink>

          <NuxtLink
            to="/search" class="flex flex-col items-center py-2 px-3 text-xs"
            :class="$route.path.startsWith('/search') ? 'text-blue-600' : 'text-gray-600'">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            검색
          </NuxtLink>

          <NuxtLink
            to="/wishlist" class="flex flex-col items-center py-2 px-3 text-xs"
            :class="$route.path.startsWith('/wishlist') ? 'text-blue-600' : 'text-gray-600'">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            찜
          </NuxtLink>

          <NuxtLink
            to="/profile" class="flex flex-col items-center py-2 px-3 text-xs"
            :class="$route.path.startsWith('/profile') ? 'text-blue-600' : 'text-gray-600'">
            <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            마이페이지
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/* 커스텀 스타일링 (필요시) */
.router-link-active {
  /* @apply text-blue-600; */
}

/* 스크롤바 숨기기 (필요시) */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>