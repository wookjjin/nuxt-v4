<script setup lang="ts">

// 📌 Banner 슬라이드
const bannerList = [
  '/images/banner1.jpg',
  '/images/banner2.jpg',
  '/images/banner3.jpg'
]
const currentBanner = ref(0)
let intervalId: ReturnType<typeof setInterval>


const bannerRefs: Ref<(HTMLElement | null)[]> = ref([])

const setBannerRef = (el: HTMLElement | null, index: number) => {
  bannerRefs.value[index] = el
}

const startAutoSlide = () => {
  intervalId = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % bannerList.length
    const el = bannerRefs.value[currentBanner.value]
    el?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
  }, 3000)
}

onMounted(() => {
  startAutoSlide()
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

// 📌 상품 로딩 상태
const isLoading = ref(true)
const bestItems = ref<{ id: number, name: string, image: string, price: number }[]>([])

onMounted(() => {
  setTimeout(() => {
    bestItems.value = [
      { id: 1, name: '베스트 상품1', image: '/images/item1.png', price: 29000 },
      { id: 2, name: '베스트 상품2', image: '/images/item2.png', price: 35000 }
    ]
    isLoading.value = false
  }, 1500)
})
</script>

<template>
  <div class="space-y-6 p-4">

    <!-- 🔹 Auto Sliding Banner -->
    <div class="w-full max-w-[1080px] mx-auto px-4">
      <div class="relative overflow-x-auto scroll-smooth">
        <div class="flex space-x-4">
          <div
            v-for="(banner, index) in bannerList" :key="index" :ref="el => setBannerRef(el as HTMLElement | null, index)"
            class="shrink-0 w-full aspect-[2/1] rounded-xl overflow-hidden">
            <img :src="banner" class="w-full h-full object-cover">
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 카테고리 -->
    <div class="grid grid-cols-4 gap-4 text-center">
      <div v-for="cat in ['의류', '잡화', '전자기기', '식품']" :key="cat" class="flex flex-col items-center">
        <div class="text-3xl">📦</div>
        <div class="text-sm mt-1">{{ cat }}</div>
      </div>
    </div>

    <!-- 🔹 베스트 상품 -->
    <div>
      <h2 class="text-lg font-semibold mb-2">🔥 인기 상품</h2>

      <div class="grid grid-cols-2 gap-4">
        <!-- 🔸 스켈레톤 UI -->
        <template v-if="isLoading">
          <div v-for="i in 2" :key="i" class="animate-pulse border rounded-lg p-2">
            <div class="bg-gray-300 h-32 w-full rounded-md" />
            <div class="mt-2 h-4 bg-gray-300 rounded w-3/4" />
            <div class="mt-1 h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </template>

        <!-- 🔸 로드 완료 -->
        <template v-else>
          <div v-for="item in bestItems" :key="item.id" class="border rounded-lg p-2">
            <img :src="item.image" class="w-full h-32 object-cover rounded-md">
            <p class="mt-2 text-sm">{{ item.name }}</p>
            <p class="font-semibold">{{ item.price.toLocaleString() }}원</p>
          </div>
        </template>
      </div>
    </div>

    <!-- 🔹 기획전 -->
    <div>
      <h2 class="text-lg font-semibold mb-2">🎁 추천 기획전</h2>
      <div class="rounded-lg bg-blue-50 p-4 text-sm">
        출퇴근족을 위한 여름 쿨템 모음! <span class="font-medium text-blue-600">최대 40% 할인</span>
      </div>
    </div>
  </div>
</template>
