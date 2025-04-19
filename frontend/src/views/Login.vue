<template>
    <div>
      <h2>Đăng nhập</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label>Tên đăng nhập:</label>
          <input v-model="form.username" type="text" required />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input v-model="form.password" type="password" required />
        </div>
        <button type="submit">Đăng nhập</button>
        <p style="color: red" v-if="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const form = ref({
    username: '',
    password: '',
  });
  const error = ref('');
  const router = useRouter();
  
  const handleLogin = async () => {
  try {
    const res = await axios.post('/login', form.value);

    const user = res.data.user;
    const token = res.data.token;

    // Lưu vào localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user.role);

    // Điều hướng theo role
    if (user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }

  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng nhập thất bại';
  }
};
  </script>
  