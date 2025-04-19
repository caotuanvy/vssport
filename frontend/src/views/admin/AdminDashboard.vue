<template>
  <section class="content">
    <h2>📊 Thống kê tổng quan</h2>
    
    <div v-if="loading" class="text-gray-500">Đang tải dữ liệu...</div>
    <div v-else>
      <ul>
        <li>Tổng sản phẩm: {{ totalProducts }}</li>
        <li>Tổng đơn hàng: {{ totalOrders }}</li>
        <li>Tổng khách hàng: {{ totalCustomers }}</li>
        <li>Tổng doanh thu: {{ formatCurrency(totalRevenue) }}</li>
      </ul>

      <!-- Biểu đồ doanh thu theo tháng và theo ngày -->
      <div class="charts">
        <div class="chart">
          <h3>Doanh thu theo tháng</h3>
          <canvas id="monthlyRevenueChart" width="400" height="200"></canvas>
        </div>
        <div class="chart">
          <h3>Doanh thu theo ngày</h3>
          <canvas id="revenueChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>

    <div v-if="error" class="text-red-500 mt-4">
      Lỗi khi tải dữ liệu. Vui lòng thử lại sau.
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watchEffect, nextTick } from 'vue';
import axios from 'axios';
import Chart from 'chart.js/auto';

const totalProducts = ref(0);
const totalOrders = ref(0);
const totalCustomers = ref(0);
const totalRevenue = ref(0);
const revenueData = ref([]);
const monthlyRevenueData = ref([]);
const loading = ref(true);
const error = ref(false);

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

onMounted(async () => {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [p, o, c] = await Promise.all([ 
      axios.get('/products', { headers }),
      axios.get('/orders', { headers }),
      axios.get('/users', { headers })
    ]);

    totalProducts.value = p.data.length;
    totalOrders.value = o.data.length;
    totalCustomers.value = c.data.length;

    // Doanh thu tổng cộng chỉ tính các đơn hàng đã duyệt
    totalRevenue.value = o.data
      .filter(order => order.status === 'approved')
      .reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);

    // Doanh thu theo ngày (đơn hàng đã duyệt)
    revenueData.value = o.data
      .filter(order => order.status === 'approved')
      .map(order => ({
        date: new Date(order.created_at).toLocaleDateString(),
        revenue: parseFloat(order.total) || 0
      }));

    // Doanh thu theo tháng (đơn hàng đã duyệt)
    monthlyRevenueData.value = o.data
      .filter(order => order.status === 'approved')
      .reduce((result, order) => {
        const month = new Date(order.created_at).getMonth();
        const year = new Date(order.created_at).getFullYear();
        const monthYear = `${month + 1}-${year}`;

        if (!result[monthYear]) {
          result[monthYear] = 0;
        }
        result[monthYear] += parseFloat(order.total) || 0;

        return result;
      }, {});

    // Biến đổi dữ liệu doanh thu theo tháng cho biểu đồ
    const monthlyRevenueChartData = Object.keys(monthlyRevenueData.value).map(month => ({
      month,
      revenue: monthlyRevenueData.value[month]
    }));

    // Cập nhật biểu đồ doanh thu theo tháng
    nextTick(() => {
      const ctx = document.getElementById('monthlyRevenueChart').getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: monthlyRevenueChartData.map(item => item.month),
            datasets: [{
              label: 'Doanh thu theo tháng',
              data: monthlyRevenueChartData.map(item => item.revenue),
              backgroundColor: '#4caf50',
              borderColor: '#4caf50',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    return `${formatCurrency(tooltipItem.raw)}`;
                  }
                }
              }
            }
          }
        });
      }
    });

  } catch (e) {
    console.error('Lỗi khi load thống kê:', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
});

watchEffect(() => {
  if (revenueData.value.length > 0) {
    nextTick(() => {
      const ctx = document.getElementById('revenueChart').getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: revenueData.value.map(item => item.date),
            datasets: [{
              label: 'Doanh thu',
              data: revenueData.value.map(item => item.revenue),
              borderColor: '#4caf50',
              fill: false,
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    return `${formatCurrency(tooltipItem.raw)}`;
                  }
                }
              }
            }
          }
        });
      }
    });
  }
});
</script>

<style scoped>
.content {
  padding: 20px;
}

h2 {
  font-size: 1.75rem;
  font-weight: bold;
  color: #333;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  font-size: 1rem;
  color: #333;
  margin: 10px 0;
}

.text-gray-500 {
  color: #6b7280;
}

.text-red-500 {
  color: #ef4444;
}

canvas {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}

.charts {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.chart {
  flex: 1;
  min-width: 48%;
}

.chart h3 {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 10px;
}
</style>
