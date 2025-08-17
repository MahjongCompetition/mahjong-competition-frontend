<template>
  <div class="home">
    <!-- 导航栏 -->
    <n-layout-header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>麻将比赛系统</h1>
        </div>
        <div class="nav">
          <n-space>
            <n-button text @click="$router.push('/')">首页</n-button>
            <n-button text @click="$router.push('/competitions')">比赛列表</n-button>
            <n-button text @click="$router.push('/teams')" v-if="authStore.isLoggedIn">团队管理</n-button>
            <n-button text @click="$router.push('/profile')" v-if="authStore.isLoggedIn">个人中心</n-button>
          </n-space>
        </div>
        <div class="auth">
          <n-space v-if="!authStore.isLoggedIn">
            <n-button @click="$router.push('/login')" type="primary">登录</n-button>
            <n-button @click="$router.push('/register')" ghost>注册</n-button>
          </n-space>
          <n-dropdown v-else :options="userMenuOptions" @select="handleUserMenuSelect">
            <n-button text>
              {{ authStore.currentUser?.nickname || authStore.currentUser?.username }}
              <n-icon><ChevronDown /></n-icon>
            </n-button>
          </n-dropdown>
        </div>
      </div>
    </n-layout-header>

    <!-- 主要内容 -->
    <n-layout-content class="main-content">
      <!-- 欢迎横幅 -->
      <div class="welcome-banner">
        <n-card>
          <div class="banner-content">
            <div class="banner-text">
              <h2>欢迎来到麻将比赛系统</h2>
              <p>参与精彩比赛，展示你的麻将技艺</p>
              <n-space>
                <n-button type="primary" size="large" @click="$router.push('/competitions')">
                  查看比赛
                </n-button>
                <n-button size="large" @click="$router.push('/register')" v-if="!authStore.isLoggedIn">
                  立即注册
                </n-button>
              </n-space>
            </div>
            <div class="banner-image">
              <n-icon size="120" color="#18a058">
                <GameController />
              </n-icon>
            </div>
          </div>
        </n-card>
      </div>

      <!-- 最新比赛 -->
      <div class="latest-competitions">
        <n-card title="最新比赛" class="section-card">
          <n-spin :show="loading">
            <n-grid :cols="3" :x-gap="16" :y-gap="16">
              <n-grid-item v-for="competition in latestCompetitions" :key="competition.id">
                <n-card :title="competition.competitionName" class="competition-card">
                  <template #header-extra>
                    <n-tag :type="competition.competitionType === 'TEAM' ? 'success' : 'info'">
                      {{ competition.competitionType === 'TEAM' ? '团队赛' : '个人赛' }}
                    </n-tag>
                  </template>
                  <p>{{ competition.description }}</p>
                  <div class="competition-info">
                    <p><strong>报名截止：</strong>{{ formatDate(competition.registrationDeadline) }}</p>
                    <p><strong>比赛时间：</strong>{{ formatDate(competition.startTime) }}</p>
                    <p><strong>最大人数：</strong>{{ competition.maxParticipants }}</p>
                  </div>
                  <template #action>
                    <n-button type="primary" @click="viewCompetition(competition.id)">
                      查看详情
                    </n-button>
                  </template>
                </n-card>
              </n-grid-item>
            </n-grid>
          </n-spin>
        </n-card>
      </div>

      <!-- 系统特色 -->
      <div class="features">
        <n-card title="系统特色" class="section-card">
          <n-grid :cols="3" :x-gap="16" :y-gap="16">
            <n-grid-item>
              <n-card class="feature-card">
                <template #header>
                  <n-space align="center">
                    <n-icon size="24" color="#18a058">
                      <Trophy />
                    </n-icon>
                    <span>专业比赛</span>
                  </n-space>
                </template>
                <p>支持个人赛和团队赛，提供完整的比赛流程管理</p>
              </n-card>
            </n-grid-item>
            <n-grid-item>
              <n-card class="feature-card">
                <template #header>
                  <n-space align="center">
                    <n-icon size="24" color="#2080f0">
                      <People />
                    </n-icon>
                    <span>团队协作</span>
                  </n-space>
                </template>
                <p>创建和管理团队，与队友一起参与团队比赛</p>
              </n-card>
            </n-grid-item>
            <n-grid-item>
              <n-card class="feature-card">
                <template #header>
                  <n-space align="center">
                    <n-icon size="24" color="#f0a020">
                      <BarChart />
                    </n-icon>
                    <span>成绩统计</span>
                  </n-space>
                </template>
                <p>详细的成绩统计和排名，实时查看比赛进度</p>
              </n-card>
            </n-grid-item>
          </n-grid>
        </n-card>
      </div>
    </n-layout-content>

    <!-- 页脚 -->
    <n-layout-footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 麻将比赛系统. All rights reserved.</p>
      </div>
    </n-layout-footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { competitionApi } from '@/api/competition'
import type { Competition } from '@/api/competition'
import { ChevronDown, GameController, Trophy, People, BarChart } from '@vicons/ionicons5'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const latestCompetitions = ref<Competition[]>([])

// 用户菜单选项
const userMenuOptions = [
  {
    label: '个人中心',
    key: 'profile'
  },
  {
    label: '退出登录',
    key: 'logout'
  }
]

// 方法
const loadLatestCompetitions = async () => {
  try {
    loading.value = true
    const competitions = await competitionApi.getAll()
    latestCompetitions.value = competitions.slice(0, 3) // 只显示前3个
  } catch (error) {
    console.error('加载比赛失败:', error)
  } finally {
    loading.value = false
  }
}

const handleUserMenuSelect = (key: string) => {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      authStore.logoutUser()
      router.push('/')
      break
  }
}

const viewCompetition = (id: number) => {
  router.push(`/competition/${id}`)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadLatestCompetitions()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h1 {
  margin: 0;
  color: #18a058;
  font-size: 24px;
}

.nav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-banner {
  margin-bottom: 40px;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
}

.banner-text h2 {
  font-size: 36px;
  margin-bottom: 16px;
  color: #18a058;
}

.banner-text p {
  font-size: 18px;
  color: #666;
  margin-bottom: 24px;
}

.section-card {
  margin-bottom: 40px;
}

.competition-card {
  height: 100%;
}

.competition-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.feature-card {
  text-align: center;
  height: 100%;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.footer {
  background: #f8f9fa;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  color: #666;
}
</style>
