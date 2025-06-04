<template>
  <div class="p-4">
    <h2>Test API đơn giản</h2>
    <button @click="callApi" class="btn">Gọi API Laravel</button>
    <p>Kết quả: {{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../axios'

const message = ref('')

const callApi = async () => {
  try {
    const res = await axios.get('/api/hello')
    message.value = res.data.message
  } catch (error) {
    message.value = 'Lỗi khi gọi API'
  }
}
</script>

<style scoped>
.btn {
  background: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  margin-top: 10px;
}
</style>
