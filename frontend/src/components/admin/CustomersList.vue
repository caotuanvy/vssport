<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Danh sách người dùng</h1>

    <div v-if="loading" class="text-gray-500">Đang tải dữ liệu...</div>
    <div v-else-if="users.length === 0" class="text-gray-500">Không có người dùng nào.</div>

    <table v-else class="min-w-full border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2">Mã người dùng</th>
          <th class="border px-4 py-2">Tên người dùng</th>
          <th class="border px-4 py-2">Vai trò</th>
          <th class="border px-4 py-2">Lý do xóa</th> <!-- Thêm cột lý do xóa -->
          <th class="border px-4 py-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.user_id" class="hover:bg-gray-50">
          <td class="border px-4 py-2">{{ user.user_id }}</td>
          <td class="border px-4 py-2">{{ user.username }}</td>
          <td class="border px-4 py-2">
            <select v-model="user.role" @change="updateRole(user)">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </td>
          <td class="border px-4 py-2">
           {{ user.deleted_at ? `Đã xóa - Lý do: ${user.deleted_reason}` : 'Chưa bị xóa' }}</td>
          <td class="border px-4 py-2">
            <button
              v-if="!user.deleted_at"
              @click="openDeleteModal(user)"
              class="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Xoá
            </button>
            <button
              v-if="user.deleted_at"
              @click="restoreUser(user)"
              class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Khôi phục
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="modal-content bg-white p-6 rounded shadow-md w-96">
        <h3 class="text-lg font-semibold mb-2">Nhập lý do xóa người dùng</h3>
        <input
          type="text"
          v-model="deleteReason"
          placeholder="Lý do xóa"
          class="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <div class="flex justify-end space-x-2">
          <button @click="confirmDelete" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Xóa
          </button>
          <button @click="closeModal" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CustomersList',
  data() {
    return {
      users: [],
      loading: true,
      isModalOpen: false,
      deleteReason: '',
      userToDelete: null,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
  try {
    const response = await axios.get('http://localhost:8000/api/users');
    this.users = response.data.map(user => {
      if (user.deleted_at) {
        user.deleted_reason = user.deleted_reason || 'Không có lý do';
      }
      return user;
    });
  } catch (error) {
    console.error('Lỗi khi tải danh sách người dùng:', error);
  } finally {
    this.loading = false;
  }
},
    openDeleteModal(user) {
      this.userToDelete = user;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.deleteReason = '';
      this.userToDelete = null;
    },
    async confirmDelete() {
  if (!this.deleteReason) {
    alert('Vui lòng nhập lý do xóa');
    return;
  }
  try {
   
    await axios.delete(`http://localhost:8000/api/users/${this.userToDelete.user_id}`, {
      data: {
        deleted_reason: this.deleteReason,
      },
    });

  
    this.users = this.users.filter(user => user.user_id !== this.userToDelete.user_id);
    this.closeModal();
  } catch (error) {
    console.error('Lỗi khi xóa tài khoản:', error);
    alert('Không thể xóa người dùng');
  }
}
,
    async updateRole(user) {
      try {
        await axios.patch(`http://localhost:8000/api/users/${user.user_id}/role`, {
          role: user.role,
        });
        alert('Cập nhật quyền thành công');
      } catch (error) {
        console.error('Lỗi khi cập nhật quyền:', error);
        alert('Không thể cập nhật quyền');
      }
    },
    async restoreUser(user) {
  try {
    await axios.post(`http://localhost:8000/api/users/${user.user_id}/restores`);
    user.deleted_at = null;
    user.deleted_reason = null;
  } catch (error) {
    console.error('Lỗi khi khôi phục tài khoản:', error);
    alert('Không thể khôi phục người dùng');
  }
}

,
  },
};
</script>

<style scoped>
.modal {
  z-index: 50;
}

.p-4 {
  padding: 1rem;
}

.text-2xl {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Table wrapper with shadow and rounded corners */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

/* Table header */
th {
  background-color: #f9fafb;
  color: #111827;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

/* Table rows and cells */
td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}

/* Hover row */
tr:hover {
  background-color: #f3f4f6;
  transition: background-color 0.2s ease;
}

.text-gray-500 {
  color: #6b7280;
}

.text-white {
  color: white;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.rounded {
  border-radius: 0.375rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-red-500 {
  color: #ef4444;
}

/* ========== CUSTOM BUTTON BLACK ========== */
button {
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

button:hover {
  background-color: #1a1a1a;
  transform: scale(1.03);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Select dropdown inside table */
select {
  margin-left: 0.5rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: #f9fafb;
  color: #111827;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

select:hover,
select:focus {
  border-color: #9ca3af;
  background-color: #fff;
}
</style>
