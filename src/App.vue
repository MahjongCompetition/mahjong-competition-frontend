<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { darkTheme } from 'naive-ui'

const authStore = useAuthStore()

// 使用暗色主题（可选）
const theme = null // 使用默认亮色主题

// 初始化认证状态
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<template>
  <n-config-provider :theme="theme">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <div id="app">
              <router-view />
            </div>
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
#app {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f8f9fa;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 全局链接样式 */
a {
  color: #18a058;
  text-decoration: none;
}

a:hover {
  color: #36ad6a;
}

/* 全局按钮样式 */
.n-button {
  font-weight: 500;
}

/* 全局卡片样式 */
.n-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 全局输入框样式 */
.n-input {
  border-radius: 6px;
}

/* 全局表格样式 */
.n-data-table {
  border-radius: 8px;
}

/* 全局分页样式 */
.n-pagination {
  margin-top: 16px;
  justify-content: center;
}
</style>
