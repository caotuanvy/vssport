<template>
  <div class="edit-product">
    <h2>Chỉnh sửa sản phẩm</h2>
    <form @submit.prevent="updateProduct">
      <div>
        <label>Tên sản phẩm:</label>
        <input v-model="product.product_name" required />
      </div>
      <div>
        <label>Giá:</label>
        <input v-model="product.price" type="number" required />
      </div>
      <div>
        <label for="category">Danh mục:</label>
        <select v-model="product.category_id" id="category" required>
        <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
          {{ category.category_name }}
        </option>
      </select>
      <br><br>
      
      <div v-if="product.images && product.images.length >= 0">
        <div v-for="(image, index) in product.images" :key="index">
          <img :src="getFullImageUrl(image.image_url)" alt="Ảnh sản phẩm" style="width: 150px;" />
        <button @click="removeImage(image.image_id)">Xóa ảnh</button>
      </div>

      <label>Thêm ảnh mới:</label>
      <input type="file" @change="handleImageUpload($event)" />


    </div>

      </div>
      <div>
        <label>Mô tả:</label>
        <textarea v-model="product.description"></textarea>
      </div>
      <button type="submit">Cập nhật</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const product = ref({
  product_name: '',
  price: '',
  category_id: '',
  description: ''
});

const categories = ref([]); 

const route = useRoute();
const router = useRouter();

const newImages = ref([]); 


const getProduct = async () => {
  try {
    const res = await axios.get(`/products/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    product.value = res.data;
  } catch (err) {
    console.error('Không thể lấy sản phẩm', err);
  }
};

const getFullImageUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `http://localhost:8000${path}`;
};

const getCategories = async () => {
  try {
    const res = await axios.get('/categories', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    categories.value = res.data;
  } catch (err) {
    console.error('Không thể lấy danh mục', err);
  }
};
 
  const removeImage = async (imageId) => {
  try {
    const res = await axios.delete(`/products/${route.params.id}/images/${imageId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    alert('Xóa ảnh thành công!');
    window.location.reload();
  } catch (err) {
    console.error('Xóa ảnh thất bại', err.response ? err.response.data : err.message);
  }

};

const handleImageUpload = async (e) => {  
  const file = e.target.files[0];  
  if (!file) return;  


  const maxSizeInMB = 2; 
  if (file.size > maxSizeInMB * 1024 * 1024) {
    alert('Kích thước tệp hình ảnh không được lớn hơn 2MB.');  
    return;  
  }  

  const formData = new FormData();  
  formData.append('image', file);  

  try {  
    await axios.post(`/products/${route.params.id}/images`, formData, {  
      headers: {  
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  
        'Content-Type': 'multipart/form-data'  
      },  
    });  
    alert('Tải ảnh lên thành công');  
    window.location.reload();
  } catch (err) {  
    console.error('Tải ảnh lên thất bại', err.response ? err.response.data : err.message);  
  }  
};  
   
const updateProduct = async () => {
  try {
    const res = await axios.put(`/products/${route.params.id}`, product.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    alert('Cập nhật thành công!');
    router.push('/admin/products');
  } catch (err) {
    console.error('Cập nhật thất bại', err.response ? err.response.data : err.message);
  }
};




onMounted(() => {
  getProduct();
  getCategories();
});
</script>

<style scoped>
.edit-product {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}
.edit-product form div {
  margin-bottom: 1rem;
}
</style>
