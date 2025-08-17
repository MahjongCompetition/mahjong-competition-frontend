<template>
  <div class="admin-login-page">
    <div class="login-container">
      <n-card title="管理员登录" class="login-card">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          @submit.prevent="handleSubmit"
        >
          <n-form-item path="username" label="用户名">
            <n-input
              v-model:value="formData.username"
              placeholder="请输入管理员用户名"
              size="large"
            />
          </n-form-item>
          
          <n-form-item path="password" label="密码">
            <n-input
              v-model:value="formData.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password-on="click"
            />
          </n-form-item>
          
          <n-form-item>
            <n-space vertical :size="16" style="width: 100%">
              <n-button
                type="primary"
                size="large"
                :loading="loading"
                @click="handleSubmit"
                style="width: 100%"
              >
                登录
              </n-button>
              
              <div class="login-options">
                <n-space justify="space-between" align="center">
                  <n-checkbox v-model:checked="rememberMe">
                    记住我
                  </n-checkbox>
                  <n-button text size="small">
                    忘记密码？
                  </n-button>
                </n-space>
              </div>
              
              <div class="back-to-user">
                <n-button text @click="$router.push('/')">
                  <template #icon>
                    <n-icon><ArrowBack /></n-icon>
                  </template>
                  返回用户端
                </n-button>
              </div>
            </n-space>
          </n-form-item>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { adminAuthApi } from '@/api/auth'
import { ArrowBack } from '@vicons/ionicons5'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

// 表单引用
const formRef = ref()

// 响应式数据
const loading = ref(false)
const rememberMe = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 处理登录
const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value?.validate()
    
    loading.value = true
    
    // 调用管理员登录API
    const result = await adminAuthApi.login(formData.username, formData.password)
    
    // 保存登录状态
    authStore.loginAdmin(result.admin, result.token)
    
    // 显示成功消息
    message.success('管理员登录成功')
    
    // 跳转到管理面板
    router.push('/admin')
    
  } catch (error: any) {
    console.error('管理员登录失败:', error)
    
    if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else if (error.message) {
      message.error(error.message)
    } else {
      message.error('登录失败，请检查用户名和密码')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
}

.login-card :deep(.n-card-header) {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.login-options {
  margin: 16px 0;
}

.back-to-user {
  text-align: center;
  margin-top: 16px;
}
</style>
