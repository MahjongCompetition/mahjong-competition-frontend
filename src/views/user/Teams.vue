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
                  <n-card class="team-card" :class="{ 'is-leader': team.isLeader }">
                    <template #header>
                      <div class="team-header">
                        <n-space align="center" justify="space-between">
                          <n-space align="center">
                            <n-icon size="24" color="#18a058">
                              <People />
                            </n-icon>
                            <span class="team-name">{{ team.teamName }}</span>
                          </n-space>
                          <n-tag 
                            :type="team.isLeader ? 'success' : 'info'" 
                            size="small"
                          >
                            {{ team.isLeader ? '队长' : '队员' }}
                          </n-tag>
                        </n-space>
                      </div>
                    </template>
                    
                    <div class="team-content">
                      <div class="team-info">
                        <p class="team-description">{{ team.description }}</p>
                        <div class="member-count">
                          <n-icon size="16" color="#666">
                            <Person />
                          </n-icon>
                          <span>{{ team.members.length }}/4人</span>
                        </div>
                      </div>
                      
                      <div class="team-members">
                        <div class="members-title">团队成员：</div>
                        <n-space wrap>
                          <n-tag 
                            v-for="member in team.members" 
                            :key="member.id" 
                            size="small"
                            :type="member.id === team.leaderId ? 'success' : 'default'"
                          >
                            {{ member.nickname || member.username }}
                            <template #suffix v-if="member.id === team.leaderId">
                              <n-icon size="12"><Star /></n-icon>
                            </template>
                          </n-tag>
                        </n-space>
                      </div>
                    </div>
                    
                    <template #footer>
                      <n-space justify="space-between">
                        <n-button 
                          v-if="team.isLeader"
                          size="small" 
                          type="warning"
                          @click="editTeam(team)"
                        >
                          编辑
                        </n-button>
                        <n-button 
                          v-if="!team.isLeader"
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
          
          <!-- 可加入的团队 -->
          <n-grid-item :span="3">
            <n-card title="可加入的团队" class="available-teams-section">
              <n-grid :cols="3" :x-gap="16" :y-gap="16">
                <n-grid-item v-for="team in availableTeams" :key="team.id">
                  <n-card class="team-card available">
                    <template #header>
                      <div class="team-header">
                        <n-space align="center" justify="space-between">
                          <n-space align="center">
                            <n-icon size="24" color="#18a058">
                              <People />
                            </n-icon>
                            <span class="team-name">{{ team.teamName }}</span>
                          </n-space>
                          <n-tag type="warning" size="small">
                            {{ team.members.length }}/4人
                          </n-tag>
                        </n-space>
                      </div>
                    </template>
                    
                    <div class="team-content">
                      <div class="team-info">
                        <p class="team-description">{{ team.description }}</p>
                        <div class="team-leader">
                          <span>队长：{{ team.leaderName }}</span>
                        </div>
                      </div>
                      
                      <div class="team-members">
                        <div class="members-title">现有成员：</div>
                        <n-space wrap>
                          <n-tag 
                            v-for="member in team.members" 
                            :key="member.id" 
                            size="small"
                          >
                            {{ member.nickname || member.username }}
                          </n-tag>
                        </n-space>
                      </div>
                    </div>
                    
                    <template #footer>
                      <n-space justify="center">
                        <n-button 
                          size="small" 
                          type="primary"
                          @click="joinTeam(team)"
                          :disabled="!authStore.isLoggedIn"
                        >
                          申请加入
                        </n-button>
                      </n-space>
                    </template>
                  </n-card>
                </n-grid-item>
                
                <n-grid-item v-if="availableTeams.length === 0">
                  <n-empty description="暂无可加入的团队" />
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
        <n-form-item label="团队描述" path="description">
          <n-input
            v-model:value="createForm.description"
            type="textarea"
            placeholder="请输入团队描述"
            :rows="3"
          />
        </n-form-item>
        <n-form-item label="团队标签" path="tags">
          <n-input v-model:value="createForm.tags" placeholder="请输入团队标签，用逗号分隔" />
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
        <n-form-item label="团队名称" path="teamName">
          <n-input v-model:value="joinForm.teamName" placeholder="请输入要加入的团队名称" />
        </n-form-item>
        <n-form-item label="申请理由" path="reason">
          <n-input
            v-model:value="joinForm.reason"
            type="textarea"
            placeholder="请输入申请加入的理由"
            :rows="3"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showJoinModal = false">取消</n-button>
          <n-button type="primary" :loading="joinLoading" @click="handleJoinSubmit">
            提交申请
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
  description: '',
  tags: ''
})

// 加入团队表单
const joinForm = reactive({
  teamName: '',
  reason: ''
})

// 表单验证规则
const createRules = {
  teamName: [
    { required: true, message: '请输入团队名称', trigger: 'blur' },
    { min: 2, max: 20, message: '团队名称长度在2-20个字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入团队描述', trigger: 'blur' },
    { max: 200, message: '团队描述不能超过200个字符', trigger: 'blur' }
  ]
}

const joinRules = {
  teamName: [
    { required: true, message: '请输入团队名称', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请输入申请理由', trigger: 'blur' },
    { max: 200, message: '申请理由不能超过200个字符', trigger: 'blur' }
  ]
}

// 模拟团队数据
const myTeams = ref([
  {
    id: 1,
    teamName: '麻将高手队',
    description: '我们是一支热爱麻将的团队，欢迎志同道合的朋友加入！',
    leaderId: 1,
    isLeader: true,
    members: [
      { id: 1, username: 'player1', nickname: '张三' },
      { id: 2, username: 'player2', nickname: '李四' },
      { id: 3, username: 'player3', nickname: '王五' }
    ]
  },
  {
    id: 2,
    teamName: '快乐麻将团',
    description: '享受麻将的乐趣，结交新朋友！',
    leaderId: 4,
    isLeader: false,
    members: [
      { id: 4, username: 'player4', nickname: '赵六' },
      { id: 5, username: 'player5', nickname: '钱七' },
      { id: 6, username: 'player6', nickname: '孙八' },
      { id: 1, username: 'player1', nickname: '张三' }
    ]
  }
])

const availableTeams = ref([
  {
    id: 3,
    teamName: '新手练习队',
    description: '新手友好，互相学习，共同进步！',
    leaderName: '周九',
    members: [
      { id: 7, username: 'player7', nickname: '周九' },
      { id: 8, username: 'player8', nickname: '吴十' }
    ]
  },
  {
    id: 4,
    teamName: '竞技麻将队',
    description: '专注竞技，追求技术，欢迎高手加入！',
    leaderName: '郑十一',
    members: [
      { id: 9, username: 'player9', nickname: '郑十一' },
      { id: 10, username: 'player10', nickname: '王十二' },
      { id: 11, username: 'player11', nickname: '李十三' }
    ]
  }
])

// 创建团队
const handleCreateSubmit = async () => {
  try {
    await createFormRef.value?.validate()
    
    createLoading.value = true
    
    // 这里应该调用实际的API来创建团队
    const newTeam = {
      id: Date.now(),
      teamName: createForm.teamName,
      description: createForm.description,
      leaderId: authStore.currentUser?.id || 0,
      isLeader: true,
      members: [
        {
          id: authStore.currentUser?.id || 0,
          username: authStore.currentUser?.username || '',
          nickname: authStore.currentUser?.nickname || ''
        }
      ]
    }
    
    myTeams.value.unshift(newTeam)
    
    message.success('团队创建成功！')
    showCreateModal.value = false
    
    // 清空表单
    Object.assign(createForm, {
      teamName: '',
      description: '',
      tags: ''
    })
    
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
    
    // 这里应该调用实际的API来申请加入团队
    message.success('申请已提交，请等待队长审核！')
    showJoinModal.value = false
    
    // 清空表单
    Object.assign(joinForm, {
      teamName: '',
      reason: ''
    })
    
  } catch (error: any) {
    console.error('申请加入失败:', error)
    message.error(error.message || '申请加入失败')
  } finally {
    joinLoading.value = false
  }
}

// 编辑团队
const editTeam = (team: any) => {
  message.info(`编辑团队功能开发中：${team.teamName}`)
}

// 退出团队
const leaveTeam = async (team: any) => {
  try {
    // 这里应该调用实际的API来退出团队
    const index = myTeams.value.findIndex(t => t.id === team.id)
    if (index > -1) {
      myTeams.value.splice(index, 1)
    }
    
    message.success(`已退出团队：${team.teamName}`)
    
  } catch (error) {
    console.error('退出团队失败:', error)
    message.error('操作失败')
  }
}

// 查看团队详情
const viewTeamDetail = (team: any) => {
  message.info(`查看团队详情功能开发中：${team.teamName}`)
}

// 加入团队
const joinTeam = (team: any) => {
  if (!authStore.isLoggedIn) {
    message.warning('请先登录')
    return
  }
  
  joinForm.teamName = team.teamName
  showJoinModal.value = true
}

// 生命周期
onMounted(() => {
  // 这里可以加载实际的团队数据
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

.my-teams-section,
.available-teams-section {
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

.team-card.available {
  border: 2px solid #f0a020;
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

.team-description {
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
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
