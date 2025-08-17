<template>
  <div class="teams-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <n-card>
        <div class="header-content">
          <div class="header-left">
            <h1>团队管理</h1>
            <p>创建和管理您的麻将团队</p>
          </div>
          <div class="header-right">
            <n-space>
              <n-button type="primary" @click="showCreateModal = true">
                <template #icon>
                  <n-icon><Add /></n-icon>
                </template>
                创建团队
              </n-button>
              <n-button @click="showJoinModal = true">
                <template #icon>
                  <n-icon><People /></n-icon>
                </template>
                加入团队
              </n-button>
            </n-space>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 团队列表 -->
    <div class="teams-list">
      <n-spin :show="loading">
        <n-grid :cols="3" :x-gap="24" :y-gap="24">
          <!-- 我的团队 -->
          <n-grid-item :span="3">
            <n-card title="我的团队" class="my-teams-section">
              <n-grid :cols="3" :x-gap="16" :y-gap="16">
                <n-grid-item v-for="team in myTeams" :key="team.id">
                  <n-card class="team-card" :class="{ 'is-leader': team.createdByMe }">
                    <template #header>
                      <div class="team-header">
                        <n-space align="center" justify="space-between">
                          <n-space align="center">
                            <n-icon size="24" color="#18a058">
                              <People />
                            </n-icon>
                            <span class="team-name">{{ team.name }}</span>
                          </n-space>
                          <n-tag 
                            :type="team.createdByMe ? 'success' : 'info'" 
                            size="small"
                          >
                            {{ team.createdByMe ? '队长' : '队员' }}
                          </n-tag>
                        </n-space>
                      </div>
                    </template>
                    
                    <div class="team-content">
                      <div class="team-info">
                        <div class="team-code">
                          <n-tag type="warning" size="small">
                            团队码：{{ team.code }}
                          </n-tag>
                        </div>
                        <div class="team-description">
                          <span>{{ team.description || '暂无描述' }}</span>
                        </div>
                        <div class="team-captain">
                          <span>队长：{{ team.captainName }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <template #footer>
                      <n-space justify="space-between">
                        <n-button 
                          v-if="team.createdByMe"
                          size="small" 
                          type="warning"
                          @click="editTeam(team)"
                        >
                          编辑
                        </n-button>
                        <n-button 
                          v-if="!team.createdByMe"
                          size="small" 
                          type="error"
                          @click="leaveTeam(team)"
                        >
                          退出
                        </n-button>
                        <n-button 
                          size="small" 
                          type="info"
                          @click="viewTeamDetail(team)"
                        >
                          详情
                        </n-button>
                      </n-space>
                    </template>
                  </n-card>
                </n-grid-item>
                
                <n-grid-item v-if="myTeams.length === 0">
                  <n-empty description="您还没有加入任何团队">
                    <template #extra>
                      <n-button type="primary" @click="showCreateModal = true">
                        创建团队
                      </n-button>
                    </template>
                  </n-empty>
                </n-grid-item>
              </n-grid>
            </n-card>
          </n-grid-item>
          

        </n-grid>
      </n-spin>
    </div>

    <!-- 创建团队对话框 -->
    <n-modal v-model:show="showCreateModal" preset="card" title="创建团队" style="width: 600px">
      <n-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-placement="left"
        label-width="100"
      >
        <n-form-item label="团队名称" path="teamName">
          <n-input v-model:value="createForm.teamName" placeholder="请输入团队名称" />
        </n-form-item>
        <n-form-item label="最大人数" path="maxMembers">
          <n-input-number 
            v-model:value="createForm.maxMembers" 
            :min="2" 
            :max="10" 
            :default-value="4"
            placeholder="请选择最大成员数量"
            style="width: 100%"
          />
        </n-form-item>
        <n-form-item label="团队描述" path="description">
          <n-input
            v-model:value="createForm.description"
            type="textarea"
            placeholder="请输入团队描述"
            :rows="3"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showCreateModal = false">取消</n-button>
          <n-button type="primary" :loading="createLoading" @click="handleCreateSubmit">
            创建团队
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 加入团队对话框 -->
    <n-modal v-model:show="showJoinModal" preset="card" title="加入团队" style="width: 500px">
      <n-form
        ref="joinFormRef"
        :model="joinForm"
        :rules="joinRules"
        label-placement="left"
        label-width="100"
      >
        <n-form-item label="团队码" path="teamCode">
          <n-input 
            v-model:value="joinForm.teamCode" 
            placeholder="请输入要加入的团队码" 
            maxlength="20"
          />
          <template #feedback>
            <span class="form-tip">团队码是加入团队的唯一标识，请向队长获取</span>
          </template>
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showJoinModal = false">取消</n-button>
          <n-button type="primary" :loading="joinLoading" @click="handleJoinSubmit">
            加入团队
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
import { teamsApi, playerTeamsApi } from '@/api/teams'
import type { Team, TeamMember, TeamInfo } from '@/api/teams'
import { 
  Add, 
  People, 
  Person, 
  Star 
} from '@vicons/ionicons5'

const message = useMessage()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const showCreateModal = ref(false)
const showJoinModal = ref(false)
const createLoading = ref(false)
const joinLoading = ref(false)

// 表单引用
const createFormRef = ref()
const joinFormRef = ref()

// 创建团队表单
const createForm = reactive({
  teamName: '',
  maxMembers: 4,
  description: ''
})

// 加入团队表单
const joinForm = reactive({
  teamCode: ''
})

// 表单验证规则
const createRules = {
  teamName: [
    { required: true, message: '请输入团队名称', trigger: 'blur' },
    { min: 2, max: 20, message: '团队名称长度在2-20个字符之间', trigger: 'blur' }
  ],
  maxMembers: [
    { 
      required: true, 
      type: 'number',
      message: '请选择最大成员数量', 
      trigger: ['input', 'blur'] 
    },
    { 
      type: 'number',
      min: 2, 
      max: 10, 
      message: '成员数量必须在2-10人之间', 
      trigger: ['input', 'blur'] 
    }
  ],
  description: [
    { required: true, message: '请输入团队描述', trigger: 'blur' },
    { max: 200, message: '团队描述不能超过200个字符', trigger: 'blur' }
  ]
}

const joinRules = {
  teamCode: [
    { required: true, message: '请输入团队码', trigger: 'blur' },
    { min: 3, max: 20, message: '团队码长度在3-20个字符之间', trigger: 'blur' }
  ]
}

// 团队数据
const myTeams = ref<TeamInfo[]>([])

// 创建团队
const handleCreateSubmit = async () => {
  try {
    await createFormRef.value?.validate()
    
    createLoading.value = true
    
    // 调用API创建团队
    const teamData = {
      teamName: createForm.teamName,
      maxMembers: createForm.maxMembers
    }
    
    const response = await teamsApi.create(teamData)
    
    if (response.code === 0) {
      message.success('团队创建成功！')
      showCreateModal.value = false
      
      // 清空表单
      Object.assign(createForm, {
        teamName: '',
        maxMembers: 4,
        description: ''
      })
      
      // 重新加载团队数据
      await loadMyTeams()
    } else {
      message.error(response.message || '创建团队失败')
    }
    
  } catch (error: any) {
    console.error('创建团队失败:', error)
    message.error(error.message || '创建团队失败')
  } finally {
    createLoading.value = false
  }
}

// 加入团队
const handleJoinSubmit = async () => {
  try {
    await joinFormRef.value?.validate()
    
    joinLoading.value = true
    
    // 调用API加入团队
    const teamCode = joinForm.teamCode.trim()
    
    try {
      const team = await teamsApi.join(teamCode)
      message.success(`成功加入团队：${team.teamName}`)
      showJoinModal.value = false
      
      // 清空表单
      joinForm.teamCode = ''
      
      // 重新加载团队数据
      await loadMyTeams()
      
    } catch (error: any) {
      if (error.message.includes('团队码无效')) {
        message.error('团队码无效，请检查后重试')
      } else if (error.message.includes('人数已满')) {
        message.error('该团队人数已满，无法加入')
      } else {
        message.error(error.message || '加入团队失败')
      }
    }
    
  } catch (error: any) {
    console.error('加入团队失败:', error)
    message.error(error.message || '加入团队失败')
  } finally {
    joinLoading.value = false
  }
}

// 编辑团队
const editTeam = (team: any) => {
  message.info(`编辑团队功能开发中：${team.name}`)
}

// 退出团队
const leaveTeam = async (team: any) => {
  try {
    // 调用API退出团队
    await teamsApi.leave(team.id)
    
    message.success(`已退出团队：${team.name}`)
    
    // 重新加载团队数据
    await loadMyTeams()
    
  } catch (error) {
    console.error('退出团队失败:', error)
    message.error('操作失败')
  }
}

// 查看团队详情
const viewTeamDetail = (team: any) => {
  message.info(`查看团队详情功能开发中：${team.name}`)
}





// 加载我的团队数据
const loadMyTeams = async () => {
  try {
    loading.value = true
    const response = await playerTeamsApi.getMyTeams()
    
    // 直接使用返回的团队数据
    myTeams.value = response.teams
    
  } catch (error) {
    console.error('加载团队数据失败:', error)
    message.error('加载团队数据失败')
  } finally {
    loading.value = false
  }
}



// 生命周期
onMounted(async () => {
  if (authStore.isLoggedIn) {
    await loadMyTeams()
  }
})
</script>

<style scoped>
.teams-page {
  padding: 20px;
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

.teams-list {
  max-width: 1200px;
  margin: 0 auto;
}

.my-teams-section {
  margin-bottom: 24px;
}

.team-card {
  height: 100%;
  transition: all 0.3s ease;
}

.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.team-card.is-leader {
  border: 2px solid #18a058;
}

.team-header {
  padding: 8px 0;
}

.team-name {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.team-content {
  padding: 16px 0;
}

.team-info {
  margin-bottom: 16px;
}

.team-code {
  margin-bottom: 8px;
}

.team-description {
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.team-captain {
  color: #666;
  font-size: 14px;
}

.member-count,
.team-leader {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}

.team-members {
  margin-top: 16px;
}

.members-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.form-tip {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}



@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .teams-list {
    padding: 0 10px;
  }
}
</style>
