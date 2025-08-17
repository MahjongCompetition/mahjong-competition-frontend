<template>
  <div class="login-page">
    <div class="login-container">
      <n-card title="用户登录" class="login-card">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          @submit.prevent="handleSubmit"
        >
          <n-form-item path="username" label="用户名">
            <n-input
              v-model:value="formData.username"
              placeholder="请输入用户名"
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
              
              <div class="register-link">
                <span>还没有账号？</span>
                <n-button text type="primary" @click="$router.push('/register')">
                  立即注册
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
import { userAuthApi } from '@/api/auth'

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
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ]
}

// 处理登录
const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value?.validate()
    
    loading.value = true
    
    // 调用登录API
    const result = await userAuthApi.login(formData.username, formData.password)
    
    // 保存登录状态
    authStore.loginUser(result.user, result.token)
    
    // 显示成功消息
    message.success('登录成功')
    
    // 跳转到首页或之前的页面
    const redirect = router.currentRoute.value.query.redirect as string
    router.push(redirect || '/')
    
  } catch (error: any) {
    console.error('登录失败:', error)
    
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
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

.login-card :deep(.n-card-header) {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #18a058;
}

.login-options {
  margin: 16px 0;
}

.register-link {
  text-align: center;
  color: #666;
}

.register-link span {
  margin-right: 8px;
}
</style>
