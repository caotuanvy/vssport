<template>
    <div>
      <h2 v-if="order">Chi Tiết Đơn Hàng #{{ order.order_id }}</h2>
      <div v-if="order">
        <p><strong>Người đặt:</strong> {{ order.user?.username || 'Ẩn danh' }}</p>
        <p><strong>Ngày đặt:</strong> {{ formatDate(order.order_date) }}</p>
        <p><strong>Tổng tiền:</strong> {{ formatCurrency(order.total) }}</p>
        <p><strong>Trạng thái:</strong>
          <span v-if="order.status === 'approved'">Đã duyệt</span>
          <span v-else-if="order.status === 'rejected'">Đã từ chối</span>
          <span v-else>Chờ duyệt</span>
        </p>
  
        <h3>Danh Sách Sản Phẩm:</h3>
        <table>
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in orderItems" :key="item.id">
              <td>{{ item.product.product_name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.product.price) }}</td>
              <td>{{ formatCurrency(item.product.price * item.quantity) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>Đang tải dữ liệu...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        order: {},
        orderItems: [],
      };
    },
    methods: {
      async fetchOrderDetail() {
        const orderId = this.$route.params.id; 
        try {
          const res = await axios.get(`http://localhost:8000/api/orders/${orderId}/details`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          this.order = res.data.order;
          this.orderItems = res.data.order_items;
        } catch (err) {
          console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
          alert('Không thể tải chi tiết đơn hàng.');
        }
      },
  
      formatDate(datetime) {
        const date = new Date(datetime);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
      },
  
      formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(amount);
      }
    },
    mounted() {
      this.fetchOrderDetail();
    },
  };
  </script>
  
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  </style>
  