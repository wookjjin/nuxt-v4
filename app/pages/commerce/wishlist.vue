<script setup>
const router = useRouter()

definePageMeta({
  title: '찜',
  layout: 'default'
})

const isEditMode = ref(false)
const selectedItems = ref([])
const sortBy = ref('recent')
const showToast = ref(false)
const toastMessage = ref('')

const wishlistItems = ref([
  {
    id: 1,
    name: '아이폰',
    price: 899000,
    originalPrice: 1200000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center',
    rating: 4.5,
    reviewCount: 1234,
    addedAt: new Date('2024-01-15'),
    category: 'electronics'
  },
  {
    id: 2,
    name: '나이키 에어맥스 운동화',
    price: 129000,
    originalPrice: 159000,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center',
    rating: 4.7,
    reviewCount: 567,
    addedAt: new Date('2024-01-10'),
    category: 'fashion'
  },
  {
    id: 3,
    name: '스타벅스 텀블러',
    price: 25000,
    originalPrice: null,
    discount: null,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop&crop=center',
    rating: 4.2,
    reviewCount: 89,
    addedAt: new Date('2024-01-05'),
    category: 'lifestyle'
  },
  {
    id: 4,
    name: '무선 이어폰',
    price: 329000,
    originalPrice: 359000,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop&crop=center',
    rating: 4.8,
    reviewCount: 2341,
    addedAt: new Date('2024-01-12'),
    category: 'electronics'
  },
  {
    id: 5,
    name: '무지 후드 티셔츠',
    price: 49000,
    originalPrice: 59000,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&crop=center',
    rating: 4.3,
    reviewCount: 156,
    addedAt: new Date('2024-01-08'),
    category: 'fashion'
  },
  {
    id: 6,
    name: '아이패드 프로 11인치',
    price: 1200000,
    originalPrice: 1350000,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop&crop=center',
    rating: 4.9,
    reviewCount: 892,
    addedAt: new Date('2024-01-03'),
    category: 'electronics'
  }
])

const sortedItems = computed(() => {
  const items = [...wishlistItems.value]

  switch (sortBy.value) {
    case 'name':
      return items.sort((a, b) => a.name.localeCompare(b.name))
    case 'price-low':
      return items.sort((a, b) => a.price - b.price)
    case 'price-high':
      return items.sort((a, b) => b.price - a.price)
    case 'recent':
    default:
      return items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
  }
})

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
  if (!isEditMode.value) {
    selectedItems.value = []
  }
}

const toggleSelectAll = () => {
  if (selectedItems.value.length === wishlistItems.value.length) {
    selectedItems.value = []
  } else {
    selectedItems.value = wishlistItems.value.map(item => item.id)
  }
}

const removeFromWishlist = (itemId) => {
  const index = wishlistItems.value.findIndex(item => item.id === itemId)
  if (index > -1) {
    const itemName = wishlistItems.value[index].name
    wishlistItems.value.splice(index, 1)
    showToastMessage(`${itemName}이(가) 찜에서 제거되었습니다`)
  }
}

const removeSelectedItems = () => {
  const count = selectedItems.value.length
  wishlistItems.value = wishlistItems.value.filter(
    item => !selectedItems.value.includes(item.id)
  )
  selectedItems.value = []
  isEditMode.value = false
  showToastMessage(`${count}개 상품이 찜에서 제거되었습니다`)
}

const addToCart = (item) => {
  console.log('Adding to cart:', item)
  showToastMessage(`${item.name}이(가) 장바구니에 담겼습니다`)
}

const addSelectedToCart = () => {
  const selectedCount = selectedItems.value.length
  console.log('Adding selected items to cart:', selectedItems.value)
  selectedItems.value = []
  isEditMode.value = false
  showToastMessage(`${selectedCount}개 상품이 장바구니에 담겼습니다`)
}

const buyNow = (item) => {
  router.push(`/checkout?item=${item.id}`)
}

const goToProduct = (productId) => {
  router.push(`/product/${productId}`)
}

const sortItems = () => {
  // sortedItems computed가 자동으로 처리
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR').format(price)
}

const formatDate = (date) => {
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return '오늘'
  if (diffDays <= 7) return `${diffDays}일 전`
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}주 전`
  return `${Math.ceil(diffDays / 30)}개월 전`
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

onMounted(() => {
  console.log('Wishlist page mounted')
})
</script>

<template>
  <div class="wishlist-page">
    <!-- Header -->
    <div class="header">
      <button class="back-btn" @click="$router.back()">
        <Icon name="mdi:arrow-left" size="24" />
      </button>
      <h1>찜</h1>
      <button v-if="wishlistItems.length > 0" class="edit-btn" @click="toggleEditMode">
        {{ isEditMode ? '완료' : '편집' }}
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="wishlistItems.length === 0" class="empty-state">
      <div class="empty-icon">
        <Icon name="mdi:heart-outline" size="80" />
      </div>
      <h2>찜한 상품이 없습니다</h2>
      <p>마음에 드는 상품을 찜해보세요!</p>
      <button class="shop-btn" @click="$router.push('/')">
        쇼핑하러 가기
      </button>
    </div>

    <!-- Wishlist Items -->
    <div v-else class="wishlist-content">
      <!-- Filter/Sort Bar -->
      <div class="filter-bar">
        <div class="item-count">총 {{ wishlistItems.length }}개</div>
        <div class="filter-actions">
          <select v-model="sortBy" class="sort-select" @change="sortItems">
            <option value="recent">최근 추가순</option>
            <option value="name">상품명순</option>
            <option value="price-low">낮은 가격순</option>
            <option value="price-high">높은 가격순</option>
          </select>
        </div>
      </div>

      <!-- Select All (Edit Mode) -->
      <div v-if="isEditMode" class="select-all-bar">
        <label class="checkbox-label">
          <input type="checkbox" :checked="selectedItems.length === wishlistItems.length" @change="toggleSelectAll">
          <span class="checkmark" />
          전체 선택
        </label>
        <button v-if="selectedItems.length > 0" class="delete-selected-btn" @click="removeSelectedItems">
          선택 삭제 ({{ selectedItems.length }})
        </button>
      </div>

      <!-- Items Grid -->
      <div class="items-grid">
        <div v-for="item in sortedItems" :key="item.id" class="item-card" :class="{ 'edit-mode': isEditMode }">
          <!-- Checkbox (Edit Mode) -->
          <div v-if="isEditMode" class="item-checkbox">
            <label class="checkbox-label">
              <input v-model="selectedItems" type="checkbox" :value="item.id">
              <span class="checkmark" />
            </label>
          </div>

          <!-- Item Image -->
          <div class="item-image" @click="!isEditMode && goToProduct(item.id)">
            <img :src="item.image" :alt="item.name">
            <button v-if="!isEditMode" class="heart-btn active" @click.stop="removeFromWishlist(item.id)">
              <Icon name="mdi:heart" size="20" />
            </button>
          </div>

          <!-- Item Info -->
          <div class="item-info" @click="!isEditMode && goToProduct(item.id)">
            <h3 class="item-name">{{ item.name }}</h3>
            <div class="item-price">
              <span v-if="item.discount" class="original-price">
                ₩{{ formatPrice(item.originalPrice) }}
              </span>
              <span class="current-price">₩{{ formatPrice(item.price) }}</span>
              <span v-if="item.discount" class="discount-rate">
                {{ item.discount }}%
              </span>
            </div>
            <div class="item-meta">
              <div class="item-meta-left">
                <span class="rating">
                  <Icon name="mdi:star" size="14" />
                  {{ item.rating }}
                </span>
                <span class="review-count">({{ item.reviewCount }})</span>
              </div>
              <span class="added-date">{{ formatDate(item.addedAt) }}</span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div v-if="!isEditMode" class="item-actions">
            <button class="cart-btn" @click="addToCart(item)">
              <Icon name="mdi:cart-plus" size="16" />
              담기
            </button>
            <button class="buy-btn" @click="buyNow(item)">
              구매
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Actions (Edit Mode) -->
    <div v-if="isEditMode && selectedItems.length > 0" class="bottom-actions">
      <button class="action-btn cart-action" @click="addSelectedToCart">
        <Icon name="mdi:cart-plus" size="20" />
        장바구니 담기 ({{ selectedItems.length }})
      </button>
      <button class="action-btn delete-action" @click="removeSelectedItems">
        <Icon name="mdi:delete" size="20" />
        삭제 ({{ selectedItems.length }})
      </button>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  padding-bottom: 100px;
}

.wishlist-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.back-btn,
.edit-btn {
  background: none;
  border: none;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateX(-2px);
}

.edit-btn {
  color: #667eea;
  font-weight: 600;
  background: rgba(102, 126, 234, 0.1);
}

.edit-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.05);
}

.empty-state {
  text-align: center;
  padding: 120px 20px;
  position: relative;
  z-index: 1;
}

.empty-icon {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  filter: drop-shadow(0 4px 20px rgba(255, 255, 255, 0.3));
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.empty-state p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  font-size: 16px;
}

.shop-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  transition: all 0.3s ease;
}

.shop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(255, 107, 107, 0.5);
}

.wishlist-content {
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.item-count {
  font-size: 15px;
  color: #667eea;
  font-weight: 600;
}

.sort-select {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.select-all-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.checkbox-label input {
  display: none;
}

.checkmark {
  width: 22px;
  height: 22px;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-right: 12px;
  position: relative;
  transition: all 0.3s ease;
  background: white;
}

.checkbox-label input:checked+.checkmark {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  transform: scale(1.1);
}

.checkbox-label input:checked+.checkmark::after {
  content: '✓';
  position: absolute;
  top: 1px;
  left: 4px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.delete-selected-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
}

.delete-selected-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.item-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.item-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.item-card.edit-mode {
  transform: none;
}

.item-card.edit-mode:hover {
  transform: translateY(-2px);
}

.item-checkbox {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  padding: 6px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.item-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.item-card:hover .item-image img {
  transform: scale(1.1);
}

.heart-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.heart-btn.active {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  transform: scale(1.1);
}

.heart-btn:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
}

.item-info {
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* 각 영역 간격 추가 */
}

.item-name {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
}

.item-price {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  /* 가격과 할인율 간격 */
}

.original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.current-price {
  font-size: 17px;
  font-weight: 700;
  color: #333;
}

.discount-rate {
  font-size: 12px;
  color: white;
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 600;
}

.item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 좌우로 정렬 */
  font-size: 13px;
  color: #666;
}

.item-meta-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #ffc107;
  background: rgba(255, 193, 7, 0.1);
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 600;
}

.review-count {
  font-size: 12px;
  color: #999;
}

.added-date {
  font-size: 12px;
  color: #aaa;
}

.cart-btn,
.buy-btn {
  flex: 1;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.cart-btn {
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.cart-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
}

.buy-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.buy-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 24px;
  display: flex;
  gap: 16px;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
}

.action-btn {
  flex: 1;
  padding: 16px 20px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  border: none;
}

.cart-action {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.cart-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.delete-action {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
}

.delete-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
}

.toast {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  color: white;
  padding: 16px 24px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(30px) scale(0.9);
}

/* 반응형 */
@media (max-width: 640px) {
  .items-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .wishlist-content {
    padding: 0 20px;
  }

  .header {
    padding: 20px;
  }

  .filter-bar {
    padding: 16px 20px;
  }

  .bottom-actions {
    padding: 16px 20px;
  }

  .item-card {
    border-radius: 16px;
  }

  .item-info {
    padding: 12px;
  }

  .item-actions {
    padding: 0 12px 12px;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 18px;
  }

  .empty-state {
    padding: 80px 20px;
  }

  .empty-state h2 {
    font-size: 20px;
  }

  .items-grid {
    gap: 12px;
  }

  .wishlist-content {
    padding: 0 16px;
  }
}
</style>