<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const mainCategories = ref([
  { id: 1, name: '패션', icon: '👗', color: '#FFE4E1' },
  { id: 2, name: '뷰티', icon: '💄', color: '#E6E6FA' },
  { id: 3, name: '가전', icon: '📱', color: '#E0F6FF' },
  { id: 4, name: '가구', icon: '🛋️', color: '#F0F8E6' },
  { id: 5, name: '스포츠', icon: '⚽', color: '#FFE4B5' },
  { id: 6, name: '도서', icon: '📚', color: '#F5F5DC' }
])

const popularCategories = ref([
  { id: 7, name: '여성의류', icon: '👚', color: '#FFE4E1', count: '2156개' },
  { id: 8, name: '남성의류', icon: '👔', color: '#E6F3FF', count: '1789개' },
  { id: 9, name: '신발', icon: '👟', color: '#E6F7E6', count: '1456개' },
  { id: 10, name: '가방', icon: '👜', color: '#FFF0E6', count: '1234개' }
])

const allCategories = ref([
  { id: 11, name: '스마트폰', icon: '📱', color: '#E0F6FF', count: '567개' },
  { id: 12, name: '노트북', icon: '💻', color: '#F0F0F0', count: '234개' },
  { id: 13, name: '키보드', icon: '⌨️', color: '#F5F5F5', count: '123개' },
  { id: 14, name: '마우스', icon: '🖱️', color: '#E8E8E8', count: '89개' },
  { id: 15, name: '헤드폰', icon: '🎧', color: '#E6E6FA', count: '456개' },
  { id: 16, name: '스피커', icon: '🔊', color: '#FFE4B5', count: '234개' },
  { id: 17, name: '시계', icon: '⌚', color: '#F0F8E6', count: '345개' },
  { id: 18, name: '카메라', icon: '📷', color: '#FFE4E1', count: '123개' },
  { id: 19, name: '게임', icon: '🎮', color: '#E6F3FF', count: '678개' },
  { id: 20, name: '완구', icon: '🧸', color: '#FFF0E6', count: '234개' }
])

const filteredCategories = computed(() => {
  if (!searchQuery.value) return allCategories.value
  return allCategories.value.filter(category =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectCategory = (category) => {
  console.log('Selected category:', category)
  // 여기에 카테고리 선택 로직 추가
  // 예: navigateTo(`/category/${category.id}`)

}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="flex items-center justify-between px-4 py-4">
        <div class="flex items-center space-x-3">
          <button class="p-1" @click="$router.back()">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-bold text-gray-900">카테고리</h1>
        </div>
        <button class="p-1">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Search Bar -->
    <div class="px-4 py-4 bg-white">
      <div class="relative">
        <input
          v-model="searchQuery" type="text" placeholder="카테고리 검색"
          class="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors">
        <svg
          class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Main Content with bottom padding for navigation -->
    <div class="px-4 pt-8 pb-24">
      <!-- Main Categories Grid -->
      <div class="grid grid-cols-3 gap-3 mb-8">
        <div
          v-for="category in mainCategories" :key="category.id" class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
          @click="selectCategory(category)">
          <div class="flex flex-col items-center space-y-3">
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
              :style="{ backgroundColor: category.color }">
              {{ category.icon }}
            </div>
            <span class="text-sm font-semibold text-gray-800 text-center">{{ category.name }}</span>
          </div>
        </div>
      </div>

      <!-- Popular Categories -->
      <div class="mb-8">
        <h2 class="text-lg font-bold text-gray-900 mb-4 px-1">인기 카테고리</h2>
        <div class="space-y-3">
          <div
            v-for="category in popularCategories" :key="category.id" class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            @click="selectCategory(category)">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm"
                  :style="{ backgroundColor: category.color }">
                  {{ category.icon }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ category.name }}</h3>
                  <p class="text-sm text-gray-500">{{ category.count }}개 상품</p>
                </div>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- All Categories -->
      <div class="mb-8">
        <h2 class="text-lg font-bold text-gray-900 mb-4 px-1">전체 카테고리</h2>
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div
            v-for="(category, index) in filteredCategories" :key="category.id" class="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
            :class="{ 'border-b border-gray-100': index < filteredCategories.length - 1 }"
            @click="selectCategory(category)">
            <div class="flex items-center space-x-4">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
                :style="{ backgroundColor: category.color }">
                {{ category.icon }}
              </div>
              <span class="font-medium text-gray-900">{{ category.name }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">{{ category.count }}</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div class="flex justify-around py-2">
        <button class="flex flex-col items-center py-2 px-3 min-w-0 flex-1">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs text-gray-600 mt-1">홈</span>
        </button>
        <button class="flex flex-col items-center py-2 px-3 min-w-0 flex-1">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="text-xs text-blue-600 mt-1 font-semibold">카테고리</span>
        </button>
        <button class="flex flex-col items-center py-2 px-3 min-w-0 flex-1">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="text-xs text-gray-600 mt-1">검색</span>
        </button>
        <button class="flex flex-col items-center py-2 px-3 min-w-0 flex-1">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span class="text-xs text-gray-600 mt-1">찜</span>
        </button>
        <button class="flex flex-col items-center py-2 px-3 min-w-0 flex-1">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-xs text-gray-600 mt-1">마이페이지</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>