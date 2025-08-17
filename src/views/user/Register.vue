<template>
  <div class="register-page">
    <div class="register-container">
      <n-card title="用户注册" class="register-card">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          @submit.prevent="handleSubmit"
        >
          <n-form-item path="username" label="用户名">
            <n-input
              v-model:value="formData.username"
              placeholder="请输入用户名（3-20个字符）"
              size="large"
              @blur="checkUsername"
            />
            <template #feedback>
              <n-text v-if="usernameStatus === 'checking'" type="info" size="small">
                检查中...
              </n-text>
              <n-text v-else-if="usernameStatus === 'available'" type="success" size="small">
                用户名可用
              </n-text>
              <n-text v-else-if="usernameStatus === 'unavailable'" type="error" size="small">
                用户名已被使用
              </n-text>
            </template>
          </n-form-item>
          
          <n-form-item path="password" label="密码">
            <n-input
              v-model:value="formData.password"
              type="password"
              placeholder="请输入密码（6-20个字符）"
              size="large"
              show-password-on="click"
            />
          </n-form-item>
          
          <n-form-item path="confirmPassword" label="确认密码">
            <n-input
              v-model:value="formData.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              size="large"
              show-password-on="click"
            />
          </n-form-item>
          
          <n-form-item path="nickname" label="昵称">
            <n-input
              v-model:value="formData.nickname"
              placeholder="请输入昵称"
              size="large"
            />
          </n-form-item>
          
          <n-form-item path="qq" label="QQ号">
            <n-input
              v-model:value="formData.qq"
              placeholder="请输入QQ号"
              size="large"
              @blur="checkQq"
            />
            <template #feedback>
              <n-text v-if="qqStatus === 'checking'" type="info" size="small">
                检查中...
              </n-text>
              <n-text v-else-if="qqStatus === 'available'" type="success" size="small">
                QQ号可用
              </n-text>
              <n-text v-else-if="qqStatus === 'unavailable'" type="error" size="small">
                QQ号已被使用
              </n-text>
            </template>
          </n-form-item>
          
          <n-form-item path="mahjongId" label="麻将ID">
            <n-input
              v-model:value="formData.mahjongId"
              placeholder="请输入麻将ID"
              size="large"
              @blur="checkMahjongId"
            />
            <template #feedback>
              <n-text v-if="mahjongIdStatus === 'checking'" type="info" size="small">
                检查中...
              </n-text>
              <n-text v-else-if="mahjongIdStatus === 'available'" type="success" size="small">
                麻将ID可用
              </n-text>
              <n-text v-else-if="mahjongIdStatus === 'unavailable'" type="error" size="small">
                麻将ID已被使用
              </n-text>
            </template>
          </n-form-item>
          
          <n-form-item path="mahjongNickname" label="麻将昵称">
            <n-input
              v-model:value="formData.mahjongNickname"
              placeholder="请输入麻将昵称"
              size="large"
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
                注册
              </n-button>
              
              <div class="login-link">
                <span>已有账号？</span>
                <n-button text type="primary" @click="$router.push('/login')">
                  立即登录
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
import { userAuthApi } from '@/api/auth'

const router = useRouter()
const message = useMessage()

// 表单引用
const formRef = ref()

// 响应式数据
const loading = ref(false)
const usernameStatus = ref<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
const qqStatus = ref<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
const mahjongIdStatus = ref<'idle' | 'checking' | 'available' | 'unavailable'>('idle')

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  qq: '',
  mahjongId: '',
  mahjongNickname: ''
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
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => {
        if (value !== formData.password) {
          return new Error('两次输入的密码不一致')
        }
        return true
      },
      trigger: 'blur'
    }
  ],
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

// 检查用户名可用性
const checkUsername = async () => {
  if (!formData.username || formData.username.length < 3) return
  
  try {
    usernameStatus.value = 'checking'
    const available = await userAuthApi.checkUsername(formData.username)
    usernameStatus.value = available ? 'available' : 'unavailable'
  } catch (error) {
    usernameStatus.value = 'idle'
  }
}

// 检查QQ可用性
const checkQq = async () => {
  if (!formData.qq) return
  
  try {
    qqStatus.value = 'checking'
    const available = await userAuthApi.checkQq(formData.qq)
    qqStatus.value = available ? 'available' : 'unavailable'
  } catch (error) {
    qqStatus.value = 'idle'
  }
}

// 检查麻将ID可用性
const checkMahjongId = async () => {
  if (!formData.mahjongId) return
  
  try {
    mahjongIdStatus.value = 'checking'
    const available = await userAuthApi.checkMahjongId(formData.mahjongId)
    mahjongIdStatus.value = available ? 'available' : 'unavailable'
  } catch (error) {
    mahjongIdStatus.value = 'idle'
  }
}

// 处理注册
const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value?.validate()
    
    // 检查用户名、QQ、麻将ID是否可用
    if (usernameStatus.value === 'unavailable') {
      message.error('用户名已被使用')
      return
    }
    if (qqStatus.value === 'unavailable') {
      message.error('QQ号已被使用')
      return
    }
    if (mahjongIdStatus.value === 'unavailable') {
      message.error('麻将ID已被使用')
      return
    }
    
    loading.value = true
    
    // 调用注册API
    await userAuthApi.register({
      username: formData.username,
      password: formData.password,
      nickname: formData.nickname,
      qq: formData.qq,
      mahjongId: formData.mahjongId,
      mahjongNickname: formData.mahjongNickname
    })
    
    // 显示成功消息
    message.success('注册成功！请登录')
    
    // 跳转到登录页
    router.push('/login')
    
  } catch (error: any) {
    console.error('注册失败:', error)
    
    if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else if (error.message) {
      message.error(error.message)
    } else {
      message.error('注册失败，请检查输入信息')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 500px;
}

.register-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

.register-card :deep(.n-card-header) {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #18a058;
}

.login-link {
  text-align: center;
  color: #666;
}

.login-link span {
  margin-right: 8px;
}
</style>
