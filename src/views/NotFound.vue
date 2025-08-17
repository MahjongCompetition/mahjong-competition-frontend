<template>
  <div class="not-found">
    <div class="not-found-content">
      <n-result
        status="404"
        title="页面未找到"
        description="抱歉，您访问的页面不存在"
      >
        <template #footer>
          <n-space>
            <n-button type="primary" @click="$router.push('/')">
              返回首页
            </n-button>
            <n-button @click="$router.go(-1)">
              返回上页
            </n-button>
          </n-space>
        </template>
      </n-result>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.not-found-content {
  text-align: center;
}
</style>
