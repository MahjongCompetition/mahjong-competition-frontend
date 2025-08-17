<template>
  <div class="competition-detail">
    <!-- 页面头部 -->
    <div class="page-header">
      <n-card>
        <div class="header-content">
          <div class="header-left">
            <n-space align="center">
              <n-button text @click="$router.go(-1)">
                <template #icon>
                  <n-icon><ArrowBack /></n-icon>
                </template>
                返回
              </n-button>
              <n-divider vertical />
              <div>
                <h1>{{ competition?.competitionName || '比赛详情' }}</h1>
                <p v-if="competition">{{ competition.description }}</p>
              </div>
            </n-space>
          </div>
          <div class="header-right">
            <n-space>
              <n-tag :type="competition?.competitionType === 'TEAM' ? 'success' : 'info'" size="large">
                {{ competition?.competitionType === 'TEAM' ? '团队赛' : '个人赛' }}
              </n-tag>
              <n-tag 
                :type="competition?.registrationClosed ? 'error' : 'success'" 
                size="large"
              >
                {{ competition?.registrationClosed ? '报名已截止' : '报名中' }}
              </n-tag>
            </n-space>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 比赛信息 -->
    <div class="competition-info">
      <n-grid :cols="2" :x-gap="24" :y-gap="24">
        <!-- 基本信息 -->
        <n-grid-item>
          <n-card title="基本信息">
            <n-space vertical>
              <div class="info-item">
                <label>比赛名称：</label>
                <span>{{ competition?.competitionName }}</span>
              </div>
              <div class="info-item">
                <label>比赛类型：</label>
                <span>{{ competition?.competitionType === 'TEAM' ? '团队赛' : '个人赛' }}</span>
              </div>
              <div class="info-item">
                <label>最大人数：</label>
                <span>{{ competition?.maxParticipants }}人</span>
              </div>
              <div class="info-item">
                <label>比赛规则：</label>
                <span>{{ competition?.rule?.ruleName }}</span>
              </div>
              <div class="info-item">
                <label>报名开始：</label>
                <span>{{ formatDate(competition?.registrationStartTime) }}</span>
              </div>
              <div class="info-item">
                <label>报名截止：</label>
                <span>{{ formatDate(competition?.registrationDeadline) }}</span>
              </div>
              <div class="info-item">
                <label>比赛开始：</label>
                <span>{{ formatDate(competition?.startTime) }}</span>
              </div>
              <div class="info-item">
                <label>比赛结束：</label>
                <span>{{ formatDate(competition?.endTime) }}</span>
              </div>
            </n-space>
          </n-card>
        </n-grid-item>

        <!-- 规则详情 -->
        <n-grid-item>
          <n-card title="规则详情">
            <div v-if="competition?.rule" class="rule-details">
              <n-space vertical>
                <div class="rule-item">
                  <label>初始分数：</label>
                  <n-tag type="info">{{ competition.rule.originPoints }}</n-tag>
                </div>
                <div class="rule-item">
                  <label>第一名：</label>
                  <n-tag type="success">+{{ competition.rule.firstPlacePoints }}</n-tag>
                </div>
                <div class="rule-item">
                  <label>第二名：</label>
                  <n-tag type="warning">+{{ competition.rule.secondPlacePoints }}</n-tag>
                </div>
                <div class="rule-item">
                  <label>第三名：</label>
                  <n-tag type="info">{{ competition.rule.thirdPlacePoints >= 0 ? '+' : '' }}{{ competition.rule.thirdPlacePoints }}</n-tag>
                </div>
                <div class="rule-item">
                  <label>第四名：</label>
                  <n-tag type="error">{{ competition.rule.fourthPlacePoints >= 0 ? '+' : '' }}{{ competition.rule.fourthPlacePoints }}</n-tag>
                </div>
              </n-space>
            </div>
            <n-empty v-else description="暂无规则信息" />
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>

    <!-- 报名状态 -->
    <div class="registration-status">
      <n-card title="报名状态">
        <n-space vertical>
          <div class="status-summary">
            <n-statistic label="已报名人数" :value="registeredCount" />
            <n-statistic label="剩余名额" :value="remainingSlots" />
            <n-statistic label="报名进度" :value="registrationProgress" suffix="%" />
          </div>
          
          <n-progress 
            :percentage="registrationProgress" 
            :color="getProgressColor(registrationProgress)"
            :show-indicator="false"
          />
          
          <div class="registration-actions">
            <n-space>
              <n-button 
                v-if="!competition?.registrationClosed && !isRegistered"
                type="primary" 
                size="large"
                @click="showRegistrationModal = true"
                :disabled="!authStore.isLoggedIn"
              >
                立即报名
              </n-button>
              <n-button 
                v-if="!competition?.registrationClosed && !isRegistered && !authStore.isLoggedIn"
                type="info" 
                size="large"
                @click="$router.push('/login')"
              >
                登录后报名
              </n-button>
              <n-button 
                v-if="isRegistered"
                type="success" 
                size="large"
                disabled
              >
                已报名
              </n-button>
              <n-button 
                v-if="competition?.registrationClosed"
                type="error" 
                size="large"
                disabled
              >
                报名已截止
              </n-button>
            </n-space>
          </div>
        </n-space>
      </n-card>
    </div>

    <!-- 参与者列表 -->
    <div class="participants-list">
      <n-card title="参与者列表">
        <n-tabs type="line" animated>
          <n-tab-pane name="individuals" tab="个人参与者">
            <n-list>
              <n-list-item v-for="participant in individualParticipants" :key="participant.id">
                <n-thing>
                  <template #header>
                    <n-space align="center">
                      <n-avatar round size="small">
                        {{ participant.nickname?.charAt(0) || participant.username?.charAt(0) || 'U' }}
                      </n-avatar>
                      <span>{{ participant.nickname || participant.username }}</span>
                      <n-tag size="small" type="info">@{{ participant.username }}</n-tag>
                    </n-space>
                  </template>
                  <template #description>
                    <div class="participant-info">
                      <span>QQ: {{ participant.qq }}</span>
                      <span>麻将ID: {{ participant.mahjongId }}</span>
                      <span>报名时间: {{ formatDate(participant.registrationTime) }}</span>
                    </div>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </n-tab-pane>
          
          <n-tab-pane name="teams" tab="团队参与者" v-if="competition?.competitionType === 'TEAM'">
            <n-list>
              <n-list-item v-for="team in teamParticipants" :key="team.id">
                <n-thing>
                  <template #header>
                    <n-space align="center">
                      <n-icon size="20" color="#18a058">
                        <People />
                      </n-icon>
                      <span>{{ team.teamName }}</span>
                      <n-tag size="small" type="success">{{ team.memberCount }}/4人</n-tag>
                    </n-space>
                  </template>
                  <template #description>
                    <div class="team-info">
                      <div class="team-members">
                        <span>团队成员：</span>
                        <n-space>
                          <n-tag 
                            v-for="member in team.members" 
                            :key="member.id" 
                            size="small"
                          >
                            {{ member.nickname || member.username }}
                          </n-tag>
                        </n-space>
                      </div>
                      <span>报名时间: {{ formatDate(team.registrationTime) }}</span>
                    </div>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>

    <!-- 报名对话框 -->
    <n-modal v-model:show="showRegistrationModal" preset="card" title="比赛报名" style="width: 500px">
      <div class="registration-form">
        <n-alert 
          type="info" 
          title="报名须知" 
          :show-icon="false"
          style="margin-bottom: 16px"
        >
          <p>请确认以下信息无误后提交报名：</p>
          <ul>
            <li>比赛名称：{{ competition?.competitionName }}</li>
            <li>比赛类型：{{ competition?.competitionType === 'TEAM' ? '团队赛' : '个人赛' }}</li>
            <li>比赛时间：{{ formatDate(competition?.startTime) }}</li>
          </ul>
        </n-alert>
        
        <n-form
          ref="registrationFormRef"
          :model="registrationForm"
          :rules="registrationRules"
          label-placement="left"
          label-width="100"
        >
          <n-form-item label="确认报名" path="confirmed">
            <n-checkbox v-model:checked="registrationForm.confirmed">
              我已阅读并同意比赛规则，确认报名参加此比赛
            </n-checkbox>
          </n-form-item>
        </n-form>
      </div>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showRegistrationModal = false">取消</n-button>
          <n-button 
            type="primary" 
            :loading="registrationLoading" 
            @click="handleRegistration"
            :disabled="!registrationForm.confirmed"
          >
            确认报名
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { competitionApi } from '@/api/competition'
import type { Competition } from '@/api/competition'
import { 
  ArrowBack, 
  People 
} from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const competition = ref<Competition | null>(null)
const showRegistrationModal = ref(false)
const registrationLoading = ref(false)

// 表单引用
const registrationFormRef = ref()

// 报名表单数据
const registrationForm = reactive({
  confirmed: false
})

// 表单验证规则
const registrationRules = {
  confirmed: [
    { 
      validator: (rule: any, value: boolean) => {
        if (!value) {
          return new Error('请确认报名信息')
        }
        return true
      },
      trigger: 'change'
    }
  ]
}

// 模拟参与者数据
const individualParticipants = ref([
  {
    id: 1,
    username: 'player1',
    nickname: '张三',
    qq: '123456789',
    mahjongId: 'MJ001',
    registrationTime: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    username: 'player2',
    nickname: '李四',
    qq: '987654321',
    mahjongId: 'MJ002',
    registrationTime: '2024-01-16T14:30:00Z'
  }
])

const teamParticipants = ref([
  {
    id: 1,
    teamName: '麻将高手队',
    memberCount: 3,
    members: [
      { id: 1, username: 'player1', nickname: '张三' },
      { id: 2, username: 'player2', nickname: '李四' },
      { id: 3, username: 'player3', nickname: '王五' }
    ],
    registrationTime: '2024-01-15T10:00:00Z'
  }
])

// 计算属性
const registeredCount = computed(() => {
  if (competition.value?.competitionType === 'TEAM') {
    return teamParticipants.value.length * 4 // 假设每个团队4人
  }
  return individualParticipants.value.length
})

const remainingSlots = computed(() => {
  if (!competition.value) return 0
  return Math.max(0, competition.value.maxParticipants - registeredCount.value)
})

const registrationProgress = computed(() => {
  if (!competition.value) return 0
  return Math.round((registeredCount.value / competition.value.maxParticipants) * 100)
})

const isRegistered = computed(() => {
  if (!authStore.currentUser) return false
  
  if (competition.value?.competitionType === 'TEAM') {
    return teamParticipants.value.some(team => 
      team.members.some(member => member.id === authStore.currentUser?.id)
    )
  }
  
  return individualParticipants.value.some(p => p.id === authStore.currentUser?.id)
})

// 加载比赛详情
const loadCompetitionDetail = async () => {
  try {
    loading.value = true
    const competitionId = Number(route.params.id)
    competition.value = await competitionApi.getById(competitionId)
  } catch (error) {
    console.error('加载比赛详情失败:', error)
    message.error('加载比赛详情失败')
  } finally {
    loading.value = false
  }
}

// 处理报名
const handleRegistration = async () => {
  try {
    await registrationFormRef.value?.validate()
    
    registrationLoading.value = true
    
    // 这里应该调用实际的API来提交报名
    // 目前使用模拟数据
    if (competition.value?.competitionType === 'TEAM') {
      // 团队赛报名逻辑
      message.info('团队赛报名功能开发中，请联系管理员')
    } else {
      // 个人赛报名
      const newParticipant = {
        id: Date.now(),
        username: authStore.currentUser?.username || '',
        nickname: authStore.currentUser?.nickname || '',
        qq: authStore.currentUser?.qq || '',
        mahjongId: authStore.currentUser?.mahjongId || '',
        registrationTime: new Date().toISOString()
      }
      
      individualParticipants.value.push(newParticipant)
      message.success('报名成功！')
    }
    
    showRegistrationModal.value = false
    registrationForm.confirmed = false
    
  } catch (error: any) {
    console.error('报名失败:', error)
    message.error(error.message || '报名失败')
  } finally {
    registrationLoading.value = false
  }
}

// 获取进度条颜色
const getProgressColor = (progress: number) => {
  if (progress < 50) return '#18a058'
  if (progress < 80) return '#f0a020'
  return '#d03050'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未设置'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadCompetitionDetail()
})
</script>

<style scoped>
.competition-detail {
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

.competition-info {
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.info-item label {
  font-weight: bold;
  color: #333;
  min-width: 80px;
}

.info-item span {
  color: #666;
}

.rule-details {
  padding: 8px 0;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.rule-item label {
  font-weight: bold;
  color: #333;
  min-width: 80px;
}

.registration-status {
  margin-bottom: 24px;
}

.status-summary {
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
}

.registration-actions {
  margin-top: 16px;
}

.participants-list {
  margin-bottom: 24px;
}

.participant-info {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

.team-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.team-members {
  display: flex;
  align-items: center;
  gap: 8px;
}

.registration-form {
  padding: 16px 0;
}
</style>
