<script setup lang="ts">

const router = useRouter()
const loading = ref(true)
const cartItems = ref([
  {
    id: 1,
    name: '무선 블루투스 이어폰',
    option: '화이트',
    price: 89000,
    originalPrice: 120000,
    quantity: 1,
    selected: true
  },
  {
    id: 2,
    name: '스마트폰 케이스',
    option: '투명',
    price: 15000,
    originalPrice: null,
    quantity: 2,
    selected: true
  },
  {
    id: 3,
    name: '노트북 거치대',
    option: '실버',
    price: 45000,
    originalPrice: 60000,
    quantity: 1,
    selected: false
  },
  {
    id: 4,
    name: '노트북 거치대',
    option: '그린',
    price: 45000,
    originalPrice: 60000,
    quantity: 1,
    selected: false
  },
  {
    id: 5,
    name: '스마트폰 케이스',
    option: '스카이 블루',
    price: 16000,
    originalPrice: null,
    quantity: 2,
    selected: true
  }
])

const deliveryFee = ref(3000)
const selectAll = ref(false)

const selectedItems = computed(() => {
  return cartItems.value.filter(item => item.selected)
})

const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
})

const updateSelectAll = () => {
  selectAll.value = cartItems.value.every(item => item.selected)
}

const toggleSelectAll = () => {
  cartItems.value.forEach(item => {
    item.selected = selectAll.value
  })
}

const increaseQuantity = (item: { quantity: number }) => {
  item.quantity++
}

const decreaseQuantity = (item: { quantity: number }) => {
  if (item.quantity > 1) {
    item.quantity--
  }
}

const removeItem = (itemId: number) => {
  const index = cartItems.value.findIndex(item => item.id === itemId)
  if (index > -1) {
    cartItems.value.splice(index, 1)
  }
  updateSelectAll()
}

const deleteSelected = () => {
  cartItems.value = cartItems.value.filter(item => !item.selected)
  selectAll.value = false
}

const formatPrice = (price: string | number | bigint) => {
  return new Intl.NumberFormat('ko-KR').format(Number(price))
}

const goBack = () => {
  router.back()
}

const goToShop = () => {
  navigateTo('/')
}

const goToCheckout = () => {
  if (selectedItems.value.length === 0) {
    alert('주문할 상품을 선택해주세요')
    return
  }
  navigateTo('/checkout')
}


onMounted(() => {
  updateSelectAll()

  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<template>
  <div class="cart-container">
    <!-- 헤더 -->
    <div class="cart-header">
      <button class="back-button" @click="goBack">
        <Icon name="heroicons:arrow-left" size="24" />
      </button>
      <h1 class="cart-title">장바구니</h1>
      <div class="cart-count">{{ cartItems.length }}</div>
    </div>

    <!-- 장바구니 내용 -->
    <div class="cart-content">
      <!-- 장바구니가 비어있을 때 -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <Icon name="heroicons:shopping-cart" size="48" class="empty-icon" />
        <h2>장바구니가 비어있습니다</h2>
        <p>원하는 상품을 담아보세요</p>
        <button class="shop-button" @click="goToShop">쇼핑하러 가기</button>
      </div>

      <!-- 장바구니 아이템들 -->
      <div v-else class="cart-items-container">
        <!-- 전체 선택 -->
        <div class="select-all">
          <label class="checkbox-label">
            <input v-model="selectAll" type="checkbox" class="checkbox" @change="toggleSelectAll">
            <span class="checkmark" />
            전체 선택
          </label>
          <button class="delete-selected" @click="deleteSelected">
            선택 삭제
          </button>
        </div>

        <!-- 아이템 목록 -->
        <div class="cart-items">
          <template v-if="loading">
            <div v-for="n in cartItems.length" :key="n" class="cart-item skeleton">
              <div class="skeleton-checkbox" />
              <div class="skeleton-info">
                <div class="skeleton-line short" />
                <div class="skeleton-line" />
                <div class="skeleton-price" />
              </div>
            </div>
          </template>
          <template v-else>
            <TransitionGroup name="cart" tag="div">
              <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <label class="checkbox-label">
                  <input v-model="item.selected" type="checkbox" class="checkbox" @change="updateSelectAll">
                  <span class="checkmark" />
                </label>

                <div class="item-info">
                  <div class="item-details">
                    <h3 class="item-name">{{ item.name }}</h3>
                    <p v-if="item.option" class="item-option">{{ item.option }}</p>
                    <div class="item-price">
                      <span class="current-price">{{ formatPrice(item.price) }}원</span>
                      <span v-if="item.originalPrice" class="original-price">
                        {{ formatPrice(item.originalPrice) }}원
                      </span>
                    </div>
                  </div>

                  <div class="item-actions">
                    <div class="quantity-control">
                      <button class="quantity-btn" :disabled="item.quantity <= 1" @click="decreaseQuantity(item)">
                        <Icon name="heroicons:minus" size="14" />
                      </button>
                      <span class="quantity">{{ item.quantity }}</span>
                      <button class="quantity-btn" @click="increaseQuantity(item)">
                        <Icon name="heroicons:plus" size="14" />
                      </button>
                    </div>
                    <button class="remove-btn" @click="removeItem(item.id)">
                      <Icon name="heroicons:trash" size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </template>
        </div>
      </div>
    </div>

    <!-- 하단 주문 정보 -->
    <div v-if="cartItems.length > 0" class="order-summary">
      <div class="summary-details">
        <div class="summary-row">
          <span>상품금액</span>
          <span>{{ formatPrice(totalPrice) }}원</span>
        </div>
        <div class="summary-row">
          <span>배송비</span>
          <span>{{ formatPrice(deliveryFee) }}원</span>
        </div>
        <div class="summary-row total">
          <span>총 결제금액</span>
          <span>{{ formatPrice(totalPrice + deliveryFee) }}원</span>
        </div>
      </div>

      <button class="checkout-button" :disabled="selectedItems.length === 0" @click="goToCheckout">
        주문하기 ({{ selectedItems.length }})
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>