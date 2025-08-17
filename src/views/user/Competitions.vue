<template>
  <div class="competitions-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <n-card>
        <div class="header-content">
          <div class="header-left">
            <h1>比赛列表</h1>
            <p>查看所有可参与的麻将比赛</p>
          </div>
          <div class="header-right">
            <n-space>
              <n-select
                v-model:value="filterType"
                :options="typeOptions"
                placeholder="选择比赛类型"
                style="width: 120px"
              />
              <n-input
                v-model:value="searchKeyword"
                placeholder="搜索比赛名称"
                style="width: 200px"
              >
                <template #prefix>
                  <n-icon><Search /></n-icon>
                </template>
              </n-input>
            </n-space>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 比赛列表 -->
    <div class="competitions-list">
      <n-spin :show="loading">
        <n-grid :cols="3" :x-gap="16" :y-gap="16">
          <n-grid-item v-for="competition in filteredCompetitions" :key="competition.id">
            <n-card :title="competition.competitionName" class="competition-card">
              <template #header-extra>
                <n-tag :type="competition.competitionType === 'TEAM' ? 'success' : 'info'">
                  {{ competition.competitionType === 'TEAM' ? '团队赛' : '个人赛' }}
                </n-tag>
              </template>
              
              <div class="competition-content">
                <p class="description">{{ competition.description }}</p>
                
                <div class="competition-info">
                  <div class="info-item">
                    <n-icon><Calendar /></n-icon>
                    <span>报名截止：{{ formatDate(competition.registrationDeadline) }}</span>
                  </div>
                  <div class="info-item">
                    <n-icon><Time /></n-icon>
                    <span>比赛时间：{{ formatDate(competition.startTime) }}</span>
                  </div>
                  <div class="info-item">
                    <n-icon><People /></n-icon>
                    <span>最大人数：{{ competition.maxParticipants }}</span>
                  </div>
                  <div class="info-item">
                    <n-icon><Bookmark /></n-icon>
                    <span>规则：{{ competition.rule.ruleName }}</span>
                  </div>
                </div>
                
                <div class="competition-status">
                  <n-tag 
                    :type="competition.registrationClosed ? 'error' : 'success'"
                    size="small"
                  >
                    {{ competition.registrationClosed ? '报名已截止' : '报名中' }}
                  </n-tag>
                </div>
              </div>
              
              <template #action>
                <n-space>
                  <n-button type="primary" @click="viewCompetition(competition.id)">
                    查看详情
                  </n-button>
                  <n-button 
                    v-if="!competition.registrationClosed && authStore.isLoggedIn"
                    @click="registerCompetition(competition)"
                  >
                    立即报名
                  </n-button>
                </n-space>
              </template>
            </n-card>
          </n-grid-item>
        </n-grid>
        
        <!-- 空状态 -->
        <n-empty v-if="!loading && filteredCompetitions.length === 0" description="暂无比赛">
          <template #extra>
            <n-button type="primary" @click="refreshCompetitions">
              刷新
            </n-button>
          </template>
        </n-empty>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { competitionApi } from '@/api/competition'
import type { Competition } from '@/api/competition'
import { 
  Search, 
  Calendar, 
  Time, 
  People, 
  Bookmark 
} from '@vicons/ionicons5'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const competitions = ref<Competition[]>([])
const filterType = ref<string>('')
const searchKeyword = ref('')

// 比赛类型选项
const typeOptions = [
  { label: '全部', value: '' },
  { label: '个人赛', value: 'INDIVIDUAL' },
  { label: '团队赛', value: 'TEAM' }
]

// 过滤后的比赛列表
const filteredCompetitions = computed(() => {
  let result = competitions.value
  
  // 按类型过滤
  if (filterType.value) {
    result = result.filter(c => c.competitionType === filterType.value)
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(c => 
      c.competitionName.toLowerCase().includes(keyword) ||
      c.description.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

// 加载比赛列表
const loadCompetitions = async () => {
  try {
    loading.value = true
    competitions.value = await competitionApi.getAll()
  } catch (error) {
    console.error('加载比赛失败:', error)
    message.error('加载比赛失败')
  } finally {
    loading.value = false
  }
}

// 刷新比赛列表
const refreshCompetitions = () => {
  loadCompetitions()
}

// 查看比赛详情
const viewCompetition = (id: number) => {
  router.push(`/competition/${id}`)
}

// 报名比赛
const registerCompetition = (competition: Competition) => {
  if (!authStore.isLoggedIn) {
    message.warning('请先登录')
    router.push('/login')
    return
  }
  
  // 这里应该跳转到报名页面或显示报名对话框
  message.info(`报名功能开发中，比赛：${competition.competitionName}`)
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadCompetitions()
})
</script>

<style scoped>
.competitions-page {
  min-height: 100vh;
  background: #f8f9fa;
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

.competitions-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.competition-card {
  height: 100%;
}

.competition-content {
  margin-bottom: 16px;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.competition-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.info-item .n-icon {
  color: #18a058;
}

.competition-status {
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .competitions-list {
    padding: 0 16px;
  }
  
  .n-grid {
    --n-cols: 1;
  }
}
</style>
