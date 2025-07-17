<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const searchQuery = ref('')
const isSearchFocused = ref(false)
const sortBy = ref('relevance')
const searchInput = ref(null)

// Mock data
const recentSearches = ref(['아이폰 15', '나이키 신발', '맥북 프로', '에어팟'])

const popularKeywords = ref([
  { term: '아이폰 15', trend: 'up' },
  { term: '갤럭시 S24', trend: 'up' },
  { term: '맥북 프로', trend: 'same' },
  { term: '에어팟', trend: 'down' },
  { term: '나이키 신발', trend: 'up' },
  { term: '삼성 노트북', trend: 'same' },
  { term: '아이패드', trend: 'up' },
  { term: '애플워치', trend: 'down' }
])

const quickCategories = ref([
  { id: 1, name: '패션', icon: '👗', color: '#FFE4E1' },
  { id: 2, name: '뷰티', icon: '💄', color: '#E6E6FA' },
  { id: 3, name: '가전', icon: '📱', color: '#E0F6FF' },
  { id: 4, name: '가구', icon: '🛋️', color: '#F0F8E6' },
  { id: 5, name: '스포츠', icon: '⚽', color: '#FFE4B5' },
  { id: 6, name: '도서', icon: '📚', color: '#F5F5DC' },
  { id: 7, name: '식품', icon: '🍎', color: '#FFE4B5' },
  { id: 8, name: '완구', icon: '🧸', color: '#FFF0E6' }
])

const searchSuggestions = ref(['스마트폰', '노트북', '의류', '신발', '가방'])

const autoCompleteResults = ref([])
const searchResults = ref([])

const filters = ref([
  { id: 1, name: '무료배송', active: false },
  { id: 2, name: '당일배송', active: false },
  { id: 3, name: '할인중', active: false },
  { id: 4, name: '브랜드', active: false },
  { id: 5, name: '가격대', active: false }
])

// Mock search results
const mockProducts = [
  {
    id: 1,
    name: '아이폰 15 Pro 128GB 블랙',
    price: 1350000,
    rating: 5,
    reviews: 128,
    image: 'https://via.placeholder.com/300x300?text=iPhone+15',
    isWishlisted: false
  },
  {
    id: 2,
    name: '맥북 프로 M3 14인치',
    price: 2390000,
    rating: 5,
    reviews: 89,
    image: 'https://via.placeholder.com/300x300?text=MacBook+Pro',
    isWishlisted: true
  },
  {
    id: 3,
    name: '에어팟 프로 2세대',
    price: 359000,
    rating: 4,
    reviews: 256,
    image: 'https://via.placeholder.com/300x300?text=AirPods+Pro',
    isWishlisted: false
  },
  {
    id: 4,
    name: '아이패드 에어 5세대',
    price: 899000,
    rating: 4,
    reviews: 167,
    image: 'https://via.placeholder.com/300x300?text=iPad+Air',
    isWishlisted: false
  }
]

// Computed
const sortedResults = computed(() => {
  const results = [...searchResults.value]

  switch (sortBy.value) {
    case 'popular':
      return results.sort((a, b) => b.reviews - a.reviews)
    case 'price_low':
      return results.sort((a, b) => a.price - b.price)
    case 'price_high':
      return results.sort((a, b) => b.price - a.price)
    case 'newest':
      return results.sort((a, b) => b.id - a.id)
    default:
      return results
  }
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Add to recent searches
    if (!recentSearches.value.includes(searchQuery.value)) {
      recentSearches.value.unshift(searchQuery.value)
      if (recentSearches.value.length > 10) {
        recentSearches.value.pop()
      }
    }

    // Mock search results
    searchResults.value = mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

    autoCompleteResults.value = []
  } else {
    searchResults.value = []
    autoCompleteResults.value = []
  }

  // Generate autocomplete
  if (searchQuery.value.length > 0 && searchResults.value.length === 0) {
    autoCompleteResults.value = [
      `${searchQuery.value} 케이스`,
      `${searchQuery.value} 액세서리`,
      `${searchQuery.value} 프로`,
      `${searchQuery.value} 미니`
    ]
  }
}

const selectAutoComplete = (result) => {
  searchQuery.value = result
  handleSearch()
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  autoCompleteResults.value = []
}

const toggleFilter = (filter) => {
  filter.active = !filter.active
}

const selectProduct = (product) => {
  console.log('Selected product:', product)
  // 상품 상세 페이지로 이동
}

const toggleWishlist = (product) => {
  product.isWishlisted = !product.isWishlisted
}

const removeRecentSearch = (index) => {
  recentSearches.value.splice(index, 1)
}

const clearRecentSearches = () => {
  recentSearches.value = []
}

const toggleVoiceSearch = () => {
  console.log('Voice search activated')
  // 음성 검색 기능 구현
}

onMounted(() => {
  searchInput.value?.focus()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-20">
      <div class="flex items-center px-4 py-4 space-x-3">
        <button class="p-1" @click="$router.back()">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Search Input -->
        <div class="flex-1 relative">
          <input
            ref="searchInput" v-model="searchQuery" type="text" placeholder="원하는 상품을 검색하세요"
            class="w-full pl-12 pr-12 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" @input="handleSearch"
            @focus="isSearchFocused = true">
          <svg
            class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <!-- Clear Button -->
          <button
            v-if="searchQuery" class="absolute right-4 top-3.5 w-5 h-5 text-gray-400 hover:text-gray-600"
            @click="clearSearch">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Voice Search -->
        <button class="p-2 text-gray-600 hover:text-blue-600" @click="toggleVoiceSearch">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="pb-24">
      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="px-4 py-4">
        <!-- Filter Bar -->
        <div class="flex items-center space-x-3 mb-4 overflow-x-auto pb-2">
          <button
            v-for="filter in filters" :key="filter.id" :class="filter.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'"
            class="flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium hover:shadow-md transition-all"
            @click="toggleFilter(filter)">
            <span>{{ filter.name }}</span>
            <svg v-if="filter.active" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Sort Options -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm text-gray-600">총 {{ searchResults.length }}개 상품</span>
          <select
            v-model="sortBy"
            class="text-sm border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="relevance">관련도순</option>
            <option value="popular">인기순</option>
            <option value="price_low">가격 낮은순</option>
            <option value="price_high">가격 높은순</option>
            <option value="newest">최신순</option>
          </select>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="product in sortedResults" :key="product.id" class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            @click="selectProduct(product)">
            <div class="aspect-square bg-gray-100 relative">
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover">
              <button
                class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                @click.stop="toggleWishlist(product)">
                <svg
                  :class="product.isWishlisted ? 'text-red-500' : 'text-gray-400'" class="w-5 h-5"
                  fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
            <div class="p-4">
              <h3 class="font-medium text-gray-900 mb-1 line-clamp-2">{{ product.name }}</h3>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg font-bold text-gray-900">{{ product.price.toLocaleString() }}원</span>
                  <div class="flex items-center space-x-1 mt-1">
                    <div class="flex">
                      <svg
                        v-for="i in 5" :key="i" :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-200'"
                        class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <span class="text-xs text-gray-500">({{ product.reviews }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Auto Complete (when typing) -->
      <div v-else-if="searchQuery && autoCompleteResults.length > 0" class="px-4 py-4">
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div
            v-for="(result, index) in autoCompleteResults" :key="index" class="flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            :class="{ 'border-b border-gray-100': index < autoCompleteResults.length - 1 }"
            @click="selectAutoComplete(result)">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="text-gray-700">{{ result }}</span>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery && searchResults.length === 0" class="px-4 py-8 text-center">
        <div class="bg-white rounded-2xl shadow-sm p-8">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
          <p class="text-gray-600 mb-6">다른 검색어를 시도해보세요</p>

          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">추천 검색어</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="suggestion in searchSuggestions" :key="suggestion"
                class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                @click="searchQuery = suggestion; handleSearch()">
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Default State (No Search) -->
      <div v-else class="px-4 py-4 space-y-6">
        <!-- Recent Searches -->
        <div v-if="recentSearches.length > 0">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-900">최근 검색어</h2>
            <button class="text-sm text-gray-500 hover:text-gray-700" @click="clearRecentSearches">
              전체삭제
            </button>
          </div>
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div
              v-for="(search, index) in recentSearches" :key="index"
              class="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              :class="{ 'border-b border-gray-100': index < recentSearches.length - 1 }">
              <div
                class="flex items-center space-x-3 flex-1 cursor-pointer"
                @click="searchQuery = search; handleSearch()">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-gray-700">{{ search }}</span>
              </div>
              <button class="p-1 text-gray-400 hover:text-gray-600" @click="removeRecentSearch(index)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Popular Searches -->
        <div>
          <h2 class="text-lg font-bold text-gray-900 mb-4">인기 검색어</h2>
          <div class="bg-white rounded-2xl shadow-sm p-4">
            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="(keyword, index) in popularKeywords" :key="index"
                class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                @click="searchQuery = keyword.term; handleSearch()">
                <span class="text-sm font-semibold text-blue-600 w-6">{{ index + 1 }}</span>
                <span class="text-gray-700 flex-1">{{ keyword.term }}</span>
                <span
                  :class="keyword.trend === 'up' ? 'text-red-500' : keyword.trend === 'down' ? 'text-blue-500' : 'text-gray-400'"
                  class="text-xs">
                  {{ keyword.trend === 'up' ? '↑' : keyword.trend === 'down' ? '↓' : '−' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Categories -->
        <div>
          <h2 class="text-lg font-bold text-gray-900 mb-4">빠른 카테고리</h2>
          <div class="grid grid-cols-4 gap-3">
            <div
              v-for="category in quickCategories" :key="category.id"
              class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
              @click="searchQuery = category.name; handleSearch()">
              <div class="flex flex-col items-center space-y-2">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  :style="{ backgroundColor: category.color }">
                  {{ category.icon }}
                </div>
                <span class="text-xs font-medium text-gray-700 text-center">{{ category.name }}</span>
              </div>
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
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="text-xs text-gray-600 mt-1">카테고리</span>
        </button>
        <button class="flex flex-col items-center py-2 px-3 min-w-0 flex-1">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="text-xs text-blue-600 mt-1 font-semibold">검색</span>
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>