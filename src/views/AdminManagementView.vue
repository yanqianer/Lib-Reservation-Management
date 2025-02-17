<template>
  <div class="p-4 w-full">
    <h1 class="text-2xl font-semibold mb-4">用户管理</h1>

    <input v-model="searchQuery" type="text" placeholder="搜索用户" class="border px-4 py-2 rounded-md mb-4 w-full" />

    <button @click="addUser()" class="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600">
      添加用户
    </button>

    <table v-if="!isEditing" class="min-w-full border-collapse">
      <thead>
        <tr>
          <th class="px-4 py-2 text-left border-b">用户名</th>
          <th class="px-4 py-2 text-left border-b">电话号码</th>
          <th class="px-4 py-2 text-left border-b">性别</th>
          <th class="px-4 py-2 text-left border-b">权限</th>
          <th class="px-4 py-2 text-left border-b">操作</th>
          <th class="px-4 py-2 text-left border-b">创建时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in filteredAdmin" :key="admin.id">
          <td class="px-4 py-2 border-b">{{ admin.name }}</td>
          <td class="px-4 py-2 border-b">{{ admin.phoneNumber }}</td>
          <td class="px-4 py-2 border-b">{{ admin.gender }}</td>
          <td class="px-4 py-2 border-b">{{ admin.role }}</td>
          <td class="px-4 py-2 border-b">{{ formatDate(admin.createTime) }}</td>
          <td class="px-4 py-2 border-b">
            <button @click="editUser(admin)"
              class="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600">
              Edit
            </button>
            <button @click="deleteUser(admin)"
              class="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 ml-2">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isEditing" class="border p-4 rounded-md">
      <h2 class="text-xl font-semibold mb-4">添加或编辑用户</h2>

      <!-- 用户名 -->
      <label class="block mb-2">用户名：</label>
      <input v-model="editingUser.name" type="text" class="border px-4 py-2 rounded-md w-full mb-1" />
      <p v-if="errors.name" class="text-red-500 text-sm mb-3">用户名不能为空</p>

      <!-- 电话号码 -->
      <label class="block mb-2">电话号码：</label>
      <input v-model="editingUser.phoneNumber" type="text" class="border px-4 py-2 rounded-md w-full mb-1" />
      <p v-if="errors.phoneNumber" class="text-red-500 text-sm mb-3">电话号码不能为空</p>

      <!-- 密码 -->
      <label class="block mb-2">密码(默认111111)：</label>
      <input v-model="defaultPassword" type="password" class="border px-4 py-2 rounded-md w-full mb-1"
        placeholder="请输入密码" />
      <p v-if="errors.phoneNumber" class="text-red-500 text-sm mb-3">密码不能为空</p>

      <!-- 性别 -->
      <label class="block mb-2">性别：</label>
      <select v-model="editingUser.gender" class="border px-4 py-2 rounded-md w-full mb-1">
        <option :value="Gender.Male">男</option>
        <option :value="Gender.Female">女</option>
        <option :value="Gender.Unknown">未知</option>
      </select>
      <p v-if="errors.gender" class="text-red-500 text-sm mb-3">性别不能为空</p>

      <!-- 权限 -->
      <label class="block mb-2">权限：</label>
      <select v-model="editingUser.role" class="border px-4 py-2 rounded-md w-full mb-1">
        <option :value="Role.Admin">Admin</option>
        <option :value="Role.SuperAdmin">SuperAdmin</option>
      </select>
      <p v-if="errors.role" class="text-red-500 text-sm mb-3">权限不能为空</p>

      <!-- 操作按钮 -->
      <button @click="saveUser" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        保存
      </button>
      <button @click="cancelEdit" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-2">
        取消
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { get } from '../orval-test/client';
import type { AdminDto } from '../orval-test/client.schemas';
import type { CreateAdminDto } from '../orval-test/client.schemas';
import { tr } from 'element-plus/es/locales.mjs';

// 定义权限枚举
enum Role {
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
}
enum Gender {
  Male = 'male',
  Female = 'female',
  Unknown = 'unknown'
}

const controller = get();
const admin = ref<AdminDto[]>([]);
const searchQuery = ref('');
const isEditing = ref(false);
const editingUser = ref<AdminDto>({} as AdminDto);

// 错误提示状态
const errors = ref({
  name: false,
  phoneNumber: false,
  gender: false,
  role: false,
});
const defaultPassword = ref('111111')

// 过滤用户列表
const filteredAdmin = computed(() => {
  return admin.value.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 获取用户列表
const getAdmin = async () => {
  const result = await controller.adminControllerFindAll();
  admin.value = result.data!;
};

// 添加用户
const addUser = () => {
  editingUser.value = {} as AdminDto; // 清空编辑区
  isEditing.value = true;
};

// 编辑用户
const editUser = (user: AdminDto) => {
  editingUser.value = { ...user }; // 填充编辑区
  isEditing.value = true;
};

// 保存用户（添加或修改）
const saveUser = async () => {
  // 校验字段
  errors.value = {
    name: !editingUser.value.name,
    phoneNumber: !editingUser.value.phoneNumber,
    gender: !editingUser.value.gender,
    role: !editingUser.value.role,
  };

  // 如果有错误，不保存
  if (Object.values(errors.value).some(error => error)) {
    return;
  }

  // 区分添加和修改
  if (editingUser.value.id) {
    try {
      const result = await controller.adminControllerUpdate(editingUser.value.id.toString(), {
        name: editingUser.value.name,
        phoneNumber: editingUser.value.phoneNumber,
        gender: editingUser.value.gender,
        role: editingUser.value.role,
        password: defaultPassword.value

      })
    } catch (error) {
      alert(error)
    }

  } else {
    // 添加用户
    try {
      const result = await controller.adminControllerCreate({
        name: editingUser.value.name,
        password: defaultPassword.value,
        phoneNumber: editingUser.value.phoneNumber,
        role: editingUser.value.role,
        gender: editingUser.value.gender
      })
    } catch (error) {
      alert(error)
    }
  }

  // 关闭编辑区
  getAdmin()
  isEditing.value = false;
  editingUser.value = {} as AdminDto;
  defaultPassword.value = '111111'
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
  editingUser.value = {} as AdminDto;
  errors.value = {
    name: false,
    phoneNumber: false,
    gender: false,
    role: false,
  };
};

// 删除用户
const deleteUser = async (user: AdminDto) => {
  try {
    const result = await controller.adminControllerRemove(user.id.toString())

  }
  catch (error) {
    alert(error)

  }
  admin.value = admin.value.filter(u => u.id !== user.id);
};
// 格式化时间
const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
onMounted(() => {
  getAdmin();
});
</script>