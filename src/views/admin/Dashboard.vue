<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <n-grid :cols="4" :x-gap="16" :y-gap="16" class="stats-grid">
      <n-grid-item>
        <n-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon competition">
              <n-icon size="32">
                <TrophyOutline />
              </n-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.competitionCount }}</div>
              <div class="stat-label">比赛总数</div>
            </div>
          </div>
        </n-card>
      </n-grid-item>
      
      <n-grid-item>
        <n-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon player">
              <n-icon size="32">
                <PeopleOutline />
              </n-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.playerCount }}</div>
              <div class="stat-label">玩家总数</div>
            </div>
          </div>
        </n-card>
      </n-grid-item>
      
      <n-grid-item>
        <n-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon team">
              <n-icon size="32">
                <PeopleCircleOutline />
              </n-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.teamCount }}</div>
              <div class="stat-label">团队总数</div>
            </div>
          </div>
        </n-card>
      </n-grid-item>
      
      <n-grid-item>
        <n-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon rule">
              <n-icon size="32">
                <BookOutline />
              </n-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.ruleCount }}</div>
              <div class="stat-label">规则总数</div>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 图表和列表 -->
    <n-grid :cols="2" :x-gap="16" :y-gap="16" class="charts-grid">
      <!-- 比赛类型分布 -->
      <n-grid-item>
        <n-card title="比赛类型分布" class="chart-card">
          <div class="chart-container">
            <n-pie
              :data="competitionTypeData"
              :options="pieOptions"
            />
          </div>
        </n-card>
      </n-grid-item>
      
      <!-- 最近比赛 -->
      <n-grid-item>
        <n-card title="最近比赛" class="chart-card">
          <n-list>
            <n-list-item v-for="competition in recentCompetitions" :key="competition.id">
              <n-thing>
                <template #header>
                  <n-space align="center">
                    <span>{{ competition.competitionName }}</span>
                    <n-tag :type="competition.competitionType === 'TEAM' ? 'success' : 'info'" size="small">
                      {{ competition.competitionType === 'TEAM' ? '团队赛' : '个人赛' }}
                    </n-tag>
                  </n-space>
                </template>
                <template #description>
                  <div class="competition-desc">
                    <p>{{ competition.description }}</p>
                    <p class="competition-time">
                      开始时间: {{ formatDate(competition.startTime) }}
                    </p>
                  </div>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 快速操作 -->
    <n-card title="快速操作" class="quick-actions">
      <n-space :size="16">
        <n-button type="primary" @click="$router.push('/admin/competitions')">
          <template #icon>
            <n-icon><Add /></n-icon>
          </template>
          创建比赛
        </n-button>
        <n-button type="info" @click="$router.push('/admin/players')">
          <template #icon>
            <n-icon><PersonAdd /></n-icon>
          </template>
          管理玩家
        </n-button>
        <n-button type="success" @click="$router.push('/admin/rules')">
          <template #icon>
            <n-icon><BookmarkAdd /></n-icon>
          </template>
          添加规则
        </n-button>
        <n-button type="warning" @click="$router.push('/admin/match-results')">
          <template #icon>
            <n-icon><DocumentAdd /></n-icon>
          </template>
          录入成绩
        </n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { competitionApi } from '@/api/competition'
import type { Competition } from '@/api/competition'
import { 
  TrophyOutline, 
  PeopleOutline, 
  PeopleCircleOutline, 
  BookOutline,
  Add,
  PersonAdd,
  BookmarkAdd,
  DocumentAdd
} from '@vicons/ionicons5'

const message = useMessage()

// 响应式数据
const stats = ref({
  competitionCount: 0,
  playerCount: 0,
  teamCount: 0,
  ruleCount: 0
})

const recentCompetitions = ref<Competition[]>([])

// 比赛类型分布数据
const competitionTypeData = ref([
  { name: '个人赛', value: 0, color: '#18a058' },
  { name: '团队赛', value: 0, color: '#2080f0' }
])

// 饼图配置
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false
}

// 加载统计数据
const loadStats = async () => {
  try {
    // 这里应该调用实际的API来获取统计数据
    // 目前使用模拟数据
    stats.value = {
      competitionCount: 12,
      playerCount: 156,
      teamCount: 23,
      ruleCount: 8
    }
    
    // 更新比赛类型分布
    const competitions = await competitionApi.getAll()
    const individualCount = competitions.filter(c => c.competitionType === 'INDIVIDUAL').length
    const teamCount = competitions.filter(c => c.competitionType === 'TEAM').length
    
    competitionTypeData.value[0].value = individualCount
    competitionTypeData.value[1].value = teamCount
    
    // 获取最近比赛
    recentCompetitions.value = competitions.slice(0, 5)
    
  } catch (error) {
    console.error('加载统计数据失败:', error)
    message.error('加载统计数据失败')
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-grid {
  margin-bottom: 24px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.competition {
  background: linear-gradient(135deg, #18a058, #36ad6a);
}

.stat-icon.player {
  background: linear-gradient(135deg, #2080f0, #4098fc);
}

.stat-icon.team {
  background: linear-gradient(135deg, #f0a020, #fcb040);
}

.stat-icon.rule {
  background: linear-gradient(135deg, #d03050, #de4d63);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #18a058;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.charts-grid {
  margin-bottom: 24px;
}

.chart-card {
  height: 400px;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.competition-desc {
  margin-top: 8px;
}

.competition-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.quick-actions {
  margin-bottom: 24px;
}
</style>
