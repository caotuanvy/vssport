<template>
  <form @submit.prevent="login">
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/axios'

const email = ref('')
const password = ref('')

const login = async () => {
  await api.get('/sanctum/csrf-cookie') // bắt buộc trước khi login
  await api.post('/login', {
    email: email.value,
    password: password.value
  }).then(res => {
    console.log('Login thành công:', res.data)
  }).catch(err => {
    console.error('Lỗi login:', err.response?.data || err)
  })
}
</script>
