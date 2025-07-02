<script setup lang="ts">

const pdfUrl = ref<string | null>(null)

const loadPDF = () => {
  pdfUrl.value = '/api/highlight-pdf' // API 호출 URL
}
</script>

<template>
  <div>
    <button @click="loadPDF">PDF 보기</button>
    <iframe v-if="pdfUrl" :src="pdfUrl" width="100%" height="900px" />
  </div>
</template>
