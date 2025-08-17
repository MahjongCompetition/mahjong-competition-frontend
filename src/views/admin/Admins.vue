<template>
  <div class="admin-admins">
    <!-- 页面头部 -->
    <div class="page-header">
      <n-card>
        <div class="header-content">
          <div class="header-left">
            <h1>管理员管理</h1>
            <p>管理系统中的所有管理员账户</p>
          </div>
          <div class="header-right">
            <n-button type="primary" @click="showCreateModal = true">
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
              创建管理员
            </n-button>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <n-card>
        <n-space align="center" justify="space-between">
          <n-space align="center">
            <n-select
              v-model:value="filterRole"
              :options="roleOptions"
              placeholder="选择管理员角色"
              style="width: 120px"
            />
            <n-select
              v-model:value="filterStatus"
              :options="statusOptions"
              placeholder="选择管理员状态"
              style="width: 120px"
            />
            <n-input
              v-model:value="searchKeyword"
              placeholder="搜索管理员用户名或姓名"
              style="width: 300px"
            >
              <template #prefix>
                <n-icon><Search /></n-icon>
              </template>
            </n-input>
          </n-space>
          <n-space>
            <n-statistic label="总管理员" :value="totalAdmins" />
            <n-statistic label="活跃管理员" :value="activeAdmins" />
          </n-space>
        </n-space>
      </n-card>
    </div>

    <!-- 管理员列表 -->
    <div class="admins-table">
      <n-card>
        <n-data-table
          :columns="columns"
          :data="filteredAdmins"
          :loading="loading"
          :pagination="pagination"
          @update:page="handlePageChange"
        />
      </n-card>
    </div>

    <!-- 创建管理员对话框 -->
    <n-modal v-model:show="showCreateModal" preset="card" title="创建管理员" style="width: 600px">
      <n-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="createForm.username" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="createForm.name" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="createForm.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item label="角色" path="role">
          <n-select
            v-model:value="createForm.role"
            :options="roleOptions"
            placeholder="选择管理员角色"
          />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="createForm.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="click"
          />
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            v-model:value="createForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password-on="click"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showCreateModal = false">取消</n-button>
          <n-button type="primary" :loading="createLoading" @click="handleCreateSubmit">
            创建
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 编辑管理员对话框 -->
    <n-modal v-model:show="showEditModal" preset="card" title="编辑管理员" style="width: 600px">
      <n-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="editForm.username" placeholder="请输入用户名" disabled />
        </n-form-item>
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="editForm.name" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="editForm.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item label="角色" path="role">
          <n-select
            v-model:value="editForm.role"
            :options="roleOptions"
            placeholder="选择管理员角色"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showEditModal = false">取消</n-button>
          <n-button type="primary" :loading="editLoading" @click="handleEditSubmit">
            保存
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 修改密码对话框 -->
    <n-modal v-model:show="showPasswordModal" preset="card" title="修改密码" style="width: 500px">
      <n-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="新密码" path="newPassword">
          <n-input
            v-model:value="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password-on="click"
          />
        </n-form-item>
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            v-model:value="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password-on="click"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showPasswordModal = false">取消</n-button>
          <n-button type="primary" :loading="passwordLoading" @click="handlePasswordSubmit">
            修改密码
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h } from 'vue'
import { useMessage } from 'naive-ui'
import type { Admin } from '@/stores/auth'
import { 
  Add, 
  Search, 
  Refresh, 
  Edit, 
  Trash, 
  Eye,
  LockClosed
} from '@vicons/ionicons5'

const message = useMessage()

// 响应式数据
const loading = ref(false)
const admins = ref<Admin[]>([])
const filterRole = ref<string>('')
const filterStatus = ref<string>('')
const searchKeyword = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const createLoading = ref(false)
const editLoading = ref(false)
const passwordLoading = ref(false)
const editingAdmin = ref<Admin | null>(null)
const changingPasswordAdmin = ref<Admin | null>(null)

// 表单引用
const createFormRef = ref()
const editFormRef = ref()
const passwordFormRef = ref()

// 创建表单数据
const createForm = reactive({
  username: '',
  name: '',
  email: '',
  role: 'ADMIN',
  password: '',
  confirmPassword: ''
})

// 编辑表单数据
const editForm = reactive({
  username: '',
  name: '',
  email: '',
  role: 'ADMIN'
})

// 密码表单数据
const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }
})

// 选项数据
const roleOptions = [
  { label: '超级管理员', value: 'SUPER_ADMIN' },
  { label: '管理员', value: 'ADMIN' },
  { label: '普通管理员', value: 'USER' }
]

const statusOptions = [
  { label: '全部', value: '' },
  { label: '正常', value: 'active' },
  { label: '已禁用', value: 'inactive' }
]

// 统计数据
const totalAdmins = computed(() => admins.value.length)
const activeAdmins = computed(() => admins.value.filter(a => a.isActive).length)

// 表单验证规则
const createRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => {
        if (value !== createForm.password) {
          return new Error('两次输入的密码不一致')
        }
        return true
      },
      trigger: 'blur'
    }
  ]
}

const editRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const passwordRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => {
        if (value !== passwordForm.newPassword) {
          return new Error('两次输入的密码不一致')
        }
        return true
      },
      trigger: 'blur'
    }
  ]
}

// 过滤后的管理员列表
const filteredAdmins = computed(() => {
  let result = admins.value
  
  // 按角色过滤
  if (filterRole.value) {
    result = result.filter(a => a.role === filterRole.value)
  }
  
  // 按状态过滤
  if (filterStatus.value) {
    if (filterStatus.value === 'active') {
      result = result.filter(a => a.isActive)
    } else if (filterStatus.value === 'inactive') {
      result = result.filter(a => !a.isActive)
    }
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(a => 
      a.username.toLowerCase().includes(keyword) ||
      a.name.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

// 表格列配置
const columns = [
  {
    title: '用户名',
    key: 'username',
    width: 150
  },
  {
    title: '姓名',
    key: 'name',
    width: 150
  },
  {
    title: '邮箱',
    key: 'email',
    width: 200
  },
  {
    title: '角色',
    key: 'role',
    width: 120,
    render: (row: Admin) => {
      const roleMap: Record<string, { label: string; type: string }> = {
        'SUPER_ADMIN': { label: '超级管理员', type: 'error' },
        'ADMIN': { label: '管理员', type: 'warning' },
        'USER': { label: '普通管理员', type: 'info' }
      }
      const roleInfo = roleMap[row.role] || { label: row.role, type: 'default' }
      return h('n-tag', {
        type: roleInfo.type as any,
        size: 'small'
      }, { default: () => roleInfo.label })
    }
  },
  {
    title: '状态',
    key: 'isActive',
    width: 100,
    render: (row: Admin) => {
      return h('n-tag', {
        type: row.isActive ? 'success' : 'error',
        size: 'small'
      }, { default: () => row.isActive ? '正常' : '已禁用' })
    }
  },
  {
    title: '最后登录',
    key: 'lastLoginTime',
    width: 150,
    render: (row: Admin) => formatDate(row.lastLoginTime)
  },
  {
    title: '操作',
    key: 'actions',
    width: 250,
    render: (row: Admin) => {
      return h('n-space', { size: 'small' }, {
        default: () => [
          h('n-button', {
            size: 'small',
            onClick: () => editAdmin(row)
          }, { default: () => '编辑', icon: () => h(Edit) }),
          h('n-button', {
            size: 'small',
            type: 'info',
            onClick: () => changePassword(row)
          }, { default: () => '改密', icon: () => h(LockClosed) }),
          h('n-button', {
            size: 'small',
            type: 'warning',
            onClick: () => toggleAdminStatus(row)
          }, { default: () => row.isActive ? '禁用' : '启用' }),
          h('n-button', {
            size: 'small',
            type: 'error',
            onClick: () => deleteAdmin(row),
            disabled: row.role === 'SUPER_ADMIN'
          }, { default: () => '删除', icon: () => h(Trash) })
        ]
      })
    }
  }
]

// 加载管理员列表
const loadAdmins = async () => {
  try {
    loading.value = true
    // 这里应该调用实际的API来获取管理员列表
    // 目前使用模拟数据
    admins.value = [
      {
        id: 1,
        username: 'superadmin',
        name: '超级管理员',
        email: 'super@example.com',
        role: 'SUPER_ADMIN',
        isActive: true,
        lastLoginTime: '2024-01-20T10:30:00Z',
        createdAt: '2024-01-01T09:00:00Z',
        updatedAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 2,
        username: 'admin1',
        name: '张三',
        email: 'admin1@example.com',
        role: 'ADMIN',
        isActive: true,
        lastLoginTime: '2024-01-19T15:20:00Z',
        createdAt: '2024-01-02T14:00:00Z',
        updatedAt: '2024-01-19T15:20:00Z'
      },
      {
        id: 3,
        username: 'admin2',
        name: '李四',
        email: 'admin2@example.com',
        role: 'USER',
        isActive: false,
        lastLoginTime: '2024-01-15T11:00:00Z',
        createdAt: '2024-01-03T16:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z'
      }
    ]
  } catch (error) {
    console.error('加载管理员失败:', error)
    message.error('加载管理员失败')
  } finally {
    loading.value = false
  }
}

// 刷新管理员列表
const refreshAdmins = () => {
  loadAdmins()
}

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
}

// 编辑管理员
const editAdmin = (admin: Admin) => {
  editingAdmin.value = admin
  editForm.username = admin.username
  editForm.name = admin.name
  editForm.email = admin.email
  editForm.role = admin.role
  showEditModal.value = true
}

// 修改密码
const changePassword = (admin: Admin) => {
  changingPasswordAdmin.value = admin
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  showPasswordModal.value = true
}

// 切换管理员状态
const toggleAdminStatus = async (admin: Admin) => {
  try {
    // 这里应该调用实际的API来切换管理员状态
    admin.isActive = !admin.isActive
    
    const action = admin.isActive ? '启用' : '禁用'
    message.success(`已${action}管理员：${admin.name}`)
    
  } catch (error) {
    console.error('切换管理员状态失败:', error)
    message.error('操作失败')
  }
}

// 删除管理员
const deleteAdmin = async (admin: Admin) => {
  try {
    // 这里应该调用实际的API来删除管理员
    const index = admins.value.findIndex(a => a.id === admin.id)
    if (index > -1) {
      admins.value.splice(index, 1)
    }
    
    message.success(`已删除管理员：${admin.name}`)
    
  } catch (error) {
    console.error('删除管理员失败:', error)
    message.error('操作失败')
  }
}

// 处理创建提交
const handleCreateSubmit = async () => {
  try {
    await createFormRef.value?.validate()
    
    createLoading.value = true
    
    // 这里应该调用实际的API来创建管理员
    const newAdmin: Admin = {
      id: Date.now(),
      username: createForm.username,
      name: createForm.name,
      email: createForm.email,
      role: createForm.role,
      isActive: true,
      lastLoginTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    admins.value.push(newAdmin)
    
    message.success('管理员创建成功')
    showCreateModal.value = false
    
    // 清空表单
    Object.assign(createForm, {
      username: '',
      name: '',
      email: '',
      role: 'ADMIN',
      password: '',
      confirmPassword: ''
    })
    
  } catch (error: any) {
    console.error('创建管理员失败:', error)
    message.error(error.message || '创建管理员失败')
  } finally {
    createLoading.value = false
  }
}

// 处理编辑提交
const handleEditSubmit = async () => {
  try {
    await editFormRef.value?.validate()
    
    if (!editingAdmin.value) return
    
    editLoading.value = true
    
    // 这里应该调用实际的API来更新管理员
    editingAdmin.value.name = editForm.name
    editingAdmin.value.email = editForm.email
    editingAdmin.value.role = editForm.role
    editingAdmin.value.updatedAt = new Date().toISOString()
    
    message.success('管理员信息更新成功')
    showEditModal.value = false
    
  } catch (error: any) {
    console.error('更新管理员失败:', error)
    message.error(error.message || '更新管理员失败')
  } finally {
    editLoading.value = false
  }
}

// 处理密码修改
const handlePasswordSubmit = async () => {
  try {
    await passwordFormRef.value?.validate()
    
    if (!changingPasswordAdmin.value) return
    
    passwordLoading.value = true
    
    // 这里应该调用实际的API来修改密码
    message.success(`已修改管理员密码：${changingPasswordAdmin.value.name}`)
    showPasswordModal.value = false
    
    // 清空密码表单
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
  } catch (error: any) {
    console.error('修改密码失败:', error)
    message.error(error.message || '修改密码失败')
  } finally {
    passwordLoading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadAdmins()
})
</script>

<style scoped>
.admin-admins {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left h1 {
  margin: 0 0 8px 0;
  color: #18a058;
  font-size: 28px;
}

.header-left p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.search-section {
  margin-bottom: 24px;
}

.admins-table {
  margin-bottom: 24px;
}
</style>
