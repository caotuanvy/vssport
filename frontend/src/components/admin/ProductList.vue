<template>
  <section class="content">
    <router-link class="addProduct" to="/admin/products/add">Thêm sản phẩm</router-link>

    <input
      v-model="searchQuery"
      @input="searchProducts"
      placeholder="Tìm kiếm sản phẩm..."
      class="search-input"
    />

    <h2>Danh sách sản phẩm</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Loại</th>
          <th>Mô tả</th>
          <th>Hình Ảnh</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="product.product_id">
          <td>{{ index + 1 }}</td>
          <td>{{ product.product_name }}</td>
          <td>{{ product.price.toLocaleString() }}đ</td>
          <td>{{ product.category?.category_name }}</td>
          <td>{{ product.description }}</td>
          <td>
            <div v-for="(image, imgIndex) in product.images" :key="imgIndex">
              <img
                :src="getFullImageUrl(image.image_url)"
                alt="Product Image"
                style="width: 50px; height: 50px; object-fit: cover; margin-right: 5px;"
              />
            </div>
          </td>
          <td>
            <button class="addProduct" @click="viewProduct(product.product_id)">👁 Xem</button>
            <button class="addProduct" @click="editProduct(product.product_id)">✏️ Sửa</button>
            <button class="addProduct" @click="deleteProduct(product.product_id)">🗑 Xoá</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const products = ref([]);
const originalProducts = ref([]);
const searchQuery = ref('');

const getProducts = async () => {
  try {
    const res = await axios.get('/products', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    products.value = res.data;
    originalProducts.value = res.data; // lưu bản gốc để search
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
  }
};

const searchProducts = () => {
  const query = searchQuery.value.trim().toLowerCase();
  products.value = originalProducts.value.filter((product) =>
    product.product_name.toLowerCase().includes(query)
  );
};

const getFullImageUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `http://localhost:8000${path}`;
};

const viewProduct = (id) => router.push(`/admin/products/${id}`);
const editProduct = (id) => router.push(`/admin/products/${id}/edit`);

const deleteProduct = async (id) => {
  if (confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
    try {
      await axios.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      await getProducts(); // reload sau khi xóa
    } catch (err) {
      console.error('Xoá thất bại', err);
    }
  }
};

onMounted(() => {
  getProducts();
});
</script>

<style scoped>
.content {
  padding: 20px;
}

.addProduct {
  background-color: #38bdf8;
  color: white;
  padding: 6px 12px;
  margin-bottom: 10px;
  display: inline-block;
  text-decoration: none;
  border-radius: 5px;
}

.search-input {
  padding: 6px 10px;
  width: 300px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
