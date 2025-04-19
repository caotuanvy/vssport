<template>
    <div>
      <h2>Thêm sản phẩm mới</h2>
      <form @submit.prevent="addProduct">
        <div>
          <label for="name">Tên sản phẩm:</label>
          <input
            type="text"
            id="name"
            v-model="name"
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>
  
        <div>
          <label for="price">Giá sản phẩm:</label>
          <input
            type="number"
            id="price"
            v-model="price"
            placeholder="Nhập giá sản phẩm"
            required
          />
        </div>
  
        <div>
          <label for="category">Danh mục:</label>
          <select v-model="category_id" required>
            <option value="">Chọn danh mục</option>
            <option v-for="category in categories" :key="category.category_id" :value="category.category_id">{{ category.category_name }}</option>
            
            <!-- Thêm các danh mục khác ở đây -->
          </select>
        </div>
  
        <div>
          <label for="description">Mô tả:</label>
          <textarea
            id="description"
            v-model="description"
            placeholder="Nhập mô tả sản phẩm"
            required
          ></textarea>
        </div>
        <div>  
        <label for="image">Chọn ảnh sản phẩm:</label>  
        <input  
          type="file"  
          id="image"  
          @change="handleImageUpload"  
          accept="image/*"  
          required  
        />  
        <div v-if="imagePreview">  
          <h4>Xem trước ảnh:</h4>  
          <img :src="imagePreview" alt="Hình ảnh sản phẩm" style="width: 150px; height: auto;" />  
        </div>  
      </div>  

        <div>
          <button type="submit">Thêm sản phẩm</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>  
  import axios from "axios";  
  
  export default {  
    data() {  
      return {  
        name: "",  
        price: "",  
        category_id: "",  
        description: "",  
        imageFile: null, 
        imagePreview: "", 
        categories :[],
      };  
    },  
    methods: {  
      handleImageUpload(event) {  
        const file = event.target.files[0];  
        if (file) {  
          this.imageFile = file;  
          this.imagePreview = URL.createObjectURL(file); 
        }  
      },  
      async getCategories(){
        try {
          const response = await axios.get("http://localhost:8000/api/categories")
          this.categories = response.data; 
        } catch(error) {
          console.error("Lỗi khi lấy danh mục sản phẩm:", error);
          alert("Có lỗi xảy ra khi tải danh mục sản phẩm.");
        }
      },
      
      async addProduct() {
  console.log("Gọi hàm addProduct");
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập trước!");
      return;
    }

    const formData = new FormData();

    formData.append("product_name", this.name);
    formData.append("price", this.price);
    formData.append("category_id", this.category_id);
    formData.append("description", this.description);

    if (this.imageFile) {
      formData.append("image", this.imageFile);
    } else {
      console.log("Chưa có ảnh được chọn!");
    }

    const response = await axios.post(
      "http://localhost:8000/api/products",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // KHÔNG đặt Content-Type ở đây,
          // Axios sẽ tự động gán `multipart/form-data` kèm boundary phù hợp
        },
      }
    );

    console.log("Phản hồi từ server:", response.data);

    if (response.status === 201) {
      alert("Sản phẩm đã được thêm thành công!");
      this.$router.push("/admin/products");
    }
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    if (error.response) {
      alert(`Lỗi: ${error.response.data.message || "Có lỗi xảy ra!"}`);
    } else {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }
}

    },  
    mounted() {
  this.getCategories();
  }
  };  
  </script>  
  <style scoped>
  form {
    max-width: 500px;
    margin: 0 auto;
  }
  
  div {
    margin-bottom: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
  