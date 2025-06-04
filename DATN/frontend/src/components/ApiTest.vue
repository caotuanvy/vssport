<template>
  <div class="p-4">
    <h1 class="text-xl font-bold">Test Laravel API</h1>

    <button @click="callHello" class="btn">Gọi /api/hello</button>
    <button @click="register" class="btn">Đăng ký</button>
    <button @click="login" class="btn">Đăng nhập</button>
    <button @click="getUser" class="btn">Lấy thông tin user</button>
    <button @click="logout" class="btn">Đăng xuất</button>

    <pre class="bg-gray-100 mt-4 p-2">{{ result }}</pre>
  </div>
</template>

<script setup>
import axios from '../axios'
import { ref } from 'vue'

const result = ref('')

const callHello = async () => {
  const res = await axios.get('/api/hello')
  result.value = res.data
}

const register = async () => {
  await axios.get('/sanctum/csrf-cookie') // BẮT BUỘC trước login/register
  const res = await axios.post('/api/register', {
    name: 'Test User',
    email: 'test' + Math.random().toString(36).substring(7) + '@gmail.com',
    password: 'password'
  })
  result.value = res.data
}

const login = async () => {
  await axios.get('/sanctum/csrf-cookie')
  const res = await axios.post('/api/login', {
    email: 'test@gmail.com', // dùng email đã đăng ký
    password: 'password'
  })
  result.value = res.data
}

const getUser = async () => {
  try {
    const res = await axios.get('/api/user')
    result.value = res.data
  } catch (err) {
    result.value = err.response.data
  }
}

const logout = async () => {
  await axios.post('/api/logout')
  result.value = 'Đã đăng xuất'
}
</script>

<style scoped>
.btn {
  margin-right: 10px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  background: #eee;
  cursor: pointer;
}
</style>
