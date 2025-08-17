<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 个人信息卡片 -->
      <n-card title="个人信息" class="profile-card">
        <n-spin :show="loading">
          <div class="profile-content" v-if="user">
            <div class="profile-header">
              <n-avatar round size="large" class="profile-avatar">
                {{ user.nickname?.charAt(0) || user.username?.charAt(0) || 'U' }}
              </n-avatar>
              <div class="profile-info">
                <h2>{{ user.nickname || user.username }}</h2>
                <p class="username">@{{ user.username }}</p>
                <p class="status">
                  <n-tag :type="user.isActive ? 'success' : 'error'" size="small">
                    {{ user.isActive ? '活跃' : '禁用' }}
                  </n-tag>
                </p>
              </div>
            </div>
            
            <n-divider />
            
            <div class="profile-details">
              <n-grid :cols="2" :x-gap="16" :y-gap="16">
                <n-grid-item>
                  <div class="detail-item">
                    <label>QQ号：</label>
                    <span>{{ user.qq }}</span>
                  </div>
                </n-grid-item>
                <n-grid-item>
                  <div class="detail-item">
                    <label>麻将ID：</label>
                    <span>{{ user.mahjongId }}</span>
                  </div>
                </n-grid-item>
                <n-grid-item>
                  <div class="detail-item">
                    <label>麻将昵称：</label>
                    <span>{{ user.mahjongNickname }}</span>
                  </div>
                </n-grid-item>
                <n-grid-item>
                  <div class="detail-item">
                    <label>注册时间：</label>
                    <span>{{ formatDate(user.createdAt) }}</span>
                  </div>
                </n-grid-item>
                <n-grid-item>
                  <div class="detail-item">
                    <label>最后登录：</label>
                    <span>{{ formatDate(user.lastLoginTime) }}</span>
                  </div>
                </n-grid-item>
                <n-grid-item>
                  <div class="detail-item">
                    <label>账号状态：</label>
                    <span>{{ user.isActive ? '正常' : '已禁用' }}</span>
                  </div>
                </n-grid-item>
              </n-grid>
            </div>
            
            <n-divider />
            
            <div class="profile-actions">
              <n-space>
                <n-button type="primary" @click="showEditModal = true">
                  <template #icon>
                    <n-icon><Edit /></n-icon>
                  </template>
                  编辑信息
                </n-button>
                <n-button @click="showPasswordModal = true">
                  <template #icon>
                    <n-icon><LockClosed /></n-icon>
                  </template>
                  修改密码
                </n-button>
              </n-space>
            </div>
          </div>
        </n-spin>
      </n-card>
    </div>

    <!-- 编辑信息对话框 -->
    <n-modal v-model:show="showEditModal" preset="card" title="编辑个人信息" style="width: 500px">
      <n-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-placement="left"
        label-width="80"
      >
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="editForm.nickname" placeholder="请输入昵称" />
        </n-form-item>
        <n-form-item label="QQ号" path="qq">
          <n-input v-model:value="editForm.qq" placeholder="请输入QQ号" />
        </n-form-item>
        <n-form-item label="麻将ID" path="mahjongId">
          <n-input v-model:value="editForm.mahjongId" placeholder="请输入麻将ID" />
        </n-form-item>
        <n-form-item label="麻将昵称" path="mahjongNickname">
          <n-input v-model:value="editForm.mahjongNickname" placeholder="请输入麻将昵称" />
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
        label-width="100"
      >
        <n-form-item label="当前密码" path="oldPassword">
          <n-input
            v-model:value="passwordForm.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password-on="click"
          />
        </n-form-item>
        <n-form-item label="新密码" path="newPassword">
          <n-input
            v-model:value="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password-on="click"
          />
        </n-form-item>
        <n-form-item label="确认新密码" path="confirmPassword">
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
import { ref, reactive, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { userAuthApi } from '@/api/auth'
import type { User } from '@/stores/auth'
import { Edit, LockClosed } from '@vicons/ionicons5'

const message = useMessage()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const user = ref<User | null>(null)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const editLoading = ref(false)
const passwordLoading = ref(false)

// 表单引用
const editFormRef = ref()
const passwordFormRef = ref()

// 编辑表单数据
const editForm = reactive({
  nickname: '',
  qq: '',
  mahjongId: '',
  mahjongNickname: ''
})

// 密码表单数据
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 编辑表单验证规则
const editRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  qq: [
    { required: true, message: '请输入QQ号', trigger: 'blur' },
    { pattern: /^\d{5,11}$/, message: '请输入正确的QQ号', trigger: 'blur' }
  ],
  mahjongId: [
    { required: true, message: '请输入麻将ID', trigger: 'blur' }
  ],
  mahjongNickname: [
    { required: true, message: '请输入麻将昵称', trigger: 'blur' }
  ]
}

// 密码表单验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
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

// 加载用户信息
const loadUserProfile = async () => {
  try {
    loading.value = true
    const profile = await userAuthApi.getProfile()
    user.value = profile
    
    // 初始化编辑表单
    editForm.nickname = profile.nickname || ''
    editForm.qq = profile.qq || ''
    editForm.mahjongId = profile.mahjongId || ''
    editForm.mahjongNickname = profile.mahjongNickname || ''
  } catch (error) {
    console.error('加载用户信息失败:', error)
    message.error('加载用户信息失败')
  } finally {
    loading.value = false
  }
}

// 处理编辑提交
const handleEditSubmit = async () => {
  try {
    await editFormRef.value?.validate()
    
    editLoading.value = true
    
    const updatedUser = await userAuthApi.updateProfile(user.value!.id, editForm)
    user.value = updatedUser
    
    message.success('个人信息更新成功')
    showEditModal.value = false
    
  } catch (error: any) {
    console.error('更新失败:', error)
    message.error(error.message || '更新失败')
  } finally {
    editLoading.value = false
  }
}

// 处理密码修改
const handlePasswordSubmit = async () => {
  try {
    await passwordFormRef.value?.validate()
    
    passwordLoading.value = true
    
    await userAuthApi.changePassword(user.value!.id, passwordForm.oldPassword, passwordForm.newPassword)
    
    message.success('密码修改成功')
    showPasswordModal.value = false
    
    // 清空密码表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
  } catch (error: any) {
    console.error('密码修改失败:', error)
    message.error(error.message || '密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-card {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.profile-avatar {
  background: linear-gradient(135deg, #18a058, #36ad6a);
  font-size: 32px;
  font-weight: bold;
}

.profile-info h2 {
  margin: 0 0 8px 0;
  color: #18a058;
  font-size: 24px;
}

.username {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 16px;
}

.status {
  margin: 0;
}

.profile-details {
  margin-bottom: 24px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.detail-item label {
  font-weight: bold;
  color: #333;
  min-width: 80px;
}

.detail-item span {
  color: #666;
}

.profile-actions {
  text-align: center;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .n-grid {
    --n-cols: 1;
  }
}
</style>
