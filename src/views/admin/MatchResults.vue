<template>
  <div class="admin-match-results">
    <!-- 页面头部 -->
    <div class="page-header">
      <n-card>
        <div class="header-content">
          <div class="header-left">
            <h1>成绩管理</h1>
            <p>管理系统中的所有比赛成绩</p>
          </div>
          <div class="header-right">
            <n-button type="primary" @click="showCreateModal = true">
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
              录入成绩
            </n-button>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <n-card>
        <n-space align="center" justify="space-between">
          <n-space align="center">
            <n-select
              v-model:value="filterCompetition"
              :options="competitionOptions"
              placeholder="选择比赛"
              style="width: 200px"
              filterable
            />
            <n-select
              v-model:value="filterRound"
              :options="roundOptions"
              placeholder="选择轮次"
              style="width: 120px"
            />
            <n-input
              v-model:value="searchKeyword"
              placeholder="搜索玩家姓名或用户名"
              style="width: 200px"
            >
              <template #prefix>
                <n-icon><Search /></n-icon>
              </template>
            </n-input>
          </n-space>
          <n-button @click="refreshResults">
            <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
            刷新
          </n-button>
        </n-space>
      </n-card>
    </div>

    <!-- 成绩列表 -->
    <div class="results-table">
      <n-card>
        <n-data-table
          :columns="columns"
          :data="filteredResults"
          :loading="loading"
          :pagination="pagination"
          @update:page="handlePageChange"
        />
      </n-card>
    </div>

    <!-- 录入成绩对话框 -->
    <n-modal v-model:show="showCreateModal" preset="card" title="录入成绩" style="width: 800px">
      <n-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-placement="left"
        label-width="120"
      >
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="选择比赛" path="competitionId">
              <n-select
                v-model:value="createForm.competitionId"
                :options="competitionOptions"
                placeholder="选择比赛"
                filterable
                @update:value="onCompetitionChange"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="轮次" path="roundNumber">
              <n-input-number
                v-model:value="createForm.roundNumber"
                placeholder="输入轮次号"
                :min="1"
                :max="20"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        
        <n-divider />
        
        <div class="results-input">
          <h4>成绩录入</h4>
          <n-space vertical>
            <div v-for="(result, index) in createForm.results" :key="index" class="result-row">
              <n-grid :cols="4" :x-gap="16" align-items="center">
                <n-grid-item>
                  <n-form-item :label="`第${index + 1}名`" :path="`results.${index}.playerId`">
                    <n-select
                      v-model:value="result.playerId"
                      :options="playerOptions"
                      placeholder="选择玩家"
                      filterable
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item :label="'得分'" :path="`results.${index}.score`">
                    <n-input-number
                      v-model:value="result.score"
                      placeholder="输入得分"
                      :min="-1000"
                      :max="1000"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item :label="'名次'" :path="`results.${index}.position`">
                    <n-input-number
                      v-model:value="result.position"
                      placeholder="输入名次"
                      :min="1"
                      :max="4"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-button 
                    type="error" 
                    size="small" 
                    @click="removeResult(index)"
                    :disabled="createForm.results.length <= 1"
                  >
                    删除
                  </n-button>
                </n-grid-item>
              </n-grid>
            </div>
          </n-space>
          
          <n-button type="dashed" @click="addResult" style="width: 100%; margin-top: 16px;">
            <template #icon>
              <n-icon><Add /></n-icon>
            </template>
            添加成绩记录
          </n-button>
        </div>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showCreateModal = false">取消</n-button>
          <n-button type="primary" :loading="createLoading" @click="handleCreateSubmit">
            保存成绩
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 成绩详情对话框 -->
    <n-modal v-model:show="showDetailModal" preset="card" title="成绩详情" style="width: 600px">
      <div v-if="selectedResult" class="result-detail">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <div class="detail-item">
              <label>比赛名称：</label>
              <span>{{ selectedResult.competitionName }}</span>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>轮次：</label>
              <span>第{{ selectedResult.roundNumber }}轮</span>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>玩家姓名：</label>
              <span>{{ selectedResult.playerName }}</span>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>用户名：</label>
              <span>{{ selectedResult.username }}</span>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>得分：</label>
              <n-tag :type="selectedResult.score >= 0 ? 'success' : 'error'" size="small">
                {{ selectedResult.score }}
              </n-tag>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>名次：</label>
              <n-tag :type="getPositionColor(selectedResult.position)" size="small">
                第{{ selectedResult.position }}名
              </n-tag>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>录入时间：</label>
              <span>{{ formatDate(selectedResult.createdAt) }}</span>
            </div>
          </n-grid-item>
        </n-grid>
        
        <n-divider />
        
        <div class="result-actions">
          <n-space>
            <n-button type="warning" @click="editResult(selectedResult)">
              编辑成绩
            </n-button>
            <n-button type="error" @click="deleteResult(selectedResult)">
              删除成绩
            </n-button>
          </n-space>
        </div>
      </div>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showDetailModal = false">关闭</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h } from 'vue'
import { useMessage } from 'naive-ui'
import { 
  Add, 
  Search, 
  Refresh, 
  Edit, 
  Trash, 
  Eye 
} from '@vicons/ionicons5'

const message = useMessage()

// 响应式数据
const loading = ref(false)
const results = ref<any[]>([])
const competitions = ref<any[]>([])
const players = ref<any[]>([])
const filterCompetition = ref<number | null>(null)
const filterRound = ref<number | null>(null)
const searchKeyword = ref('')
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const createLoading = ref(false)
const selectedResult = ref<any>(null)

// 表单引用
const createFormRef = ref()

// 创建表单数据
const createForm = reactive({
  competitionId: null as number | null,
  roundNumber: 1,
  results: [
    { playerId: null, score: 0, position: 1 }
  ]
})

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }
})

// 选项数据
const competitionOptions = computed(() => {
  return competitions.value.map(c => ({
    label: c.competitionName,
    value: c.id
  }))
})

const roundOptions = [
  { label: '第1轮', value: 1 },
  { label: '第2轮', value: 2 },
  { label: '第3轮', value: 3 },
  { label: '第4轮', value: 4 },
  { label: '第5轮', value: 5 }
]

const playerOptions = computed(() => {
  return players.value.map(p => ({
    label: `${p.nickname || p.username} (${p.username})`,
    value: p.id
  }))
})

// 表单验证规则
const createRules = {
  competitionId: [
    { required: true, message: '请选择比赛', trigger: 'change' }
  ],
  roundNumber: [
    { required: true, message: '请输入轮次', trigger: 'blur' }
  ]
}

// 过滤后的成绩列表
const filteredResults = computed(() => {
  let result = results.value
  
  // 按比赛过滤
  if (filterCompetition.value) {
    result = result.filter(r => r.competitionId === filterCompetition.value)
  }
  
  // 按轮次过滤
  if (filterRound.value) {
    result = result.filter(r => r.roundNumber === filterRound.value)
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(r => 
      r.playerName.toLowerCase().includes(keyword) ||
      r.username.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

// 表格列配置
const columns = [
  {
    title: '比赛名称',
    key: 'competitionName',
    width: 200
  },
  {
    title: '轮次',
    key: 'roundNumber',
    width: 100,
    render: (row: any) => `第${row.roundNumber}轮`
  },
  {
    title: '玩家姓名',
    key: 'playerName',
    width: 150
  },
  {
    title: '用户名',
    key: 'username',
    width: 150
  },
  {
    title: '得分',
    key: 'score',
    width: 100,
    render: (row: any) => {
      return h('n-tag', {
        type: row.score >= 0 ? 'success' : 'error',
        size: 'small'
      }, { default: () => row.score })
    }
  },
  {
    title: '名次',
    key: 'position',
    width: 100,
    render: (row: any) => {
      return h('n-tag', {
        type: getPositionColor(row.position),
        size: 'small'
      }, { default: () => `第${row.position}名` })
    }
  },
  {
    title: '录入时间',
    key: 'createdAt',
    width: 150,
    render: (row: any) => formatDate(row.createdAt)
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render: (row: any) => {
      return h('n-space', { size: 'small' }, {
        default: () => [
          h('n-button', {
            size: 'small',
            onClick: () => viewResult(row)
          }, { default: () => '查看', icon: () => h(Eye) }),
          h('n-button', {
            size: 'small',
            type: 'warning',
            onClick: () => editResult(row)
          }, { default: () => '编辑', icon: () => h(Edit) }),
          h('n-button', {
            size: 'small',
            type: 'error',
            onClick: () => deleteResult(row)
          }, { default: () => '删除', icon: () => h(Trash) })
        ]
      })
    }
  }
]

// 加载成绩列表
const loadResults = async () => {
  try {
    loading.value = true
    // 这里应该调用实际的API来获取成绩列表
    // 目前使用模拟数据
    results.value = [
      {
        id: 1,
        competitionId: 1,
        competitionName: '2024春季麻将个人赛',
        roundNumber: 1,
        playerId: 1,
        playerName: '张三',
        username: 'player1',
        score: 100,
        position: 1,
        createdAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 2,
        competitionId: 1,
        competitionName: '2024春季麻将个人赛',
        roundNumber: 1,
        playerId: 2,
        playerName: '李四',
        username: 'player2',
        score: 50,
        position: 2,
        createdAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 3,
        competitionId: 1,
        competitionName: '2024春季麻将个人赛',
        roundNumber: 1,
        playerId: 3,
        playerName: '王五',
        username: 'player3',
        score: 0,
        position: 3,
        createdAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 4,
        competitionId: 1,
        competitionName: '2024春季麻将个人赛',
        roundNumber: 1,
        playerId: 4,
        playerName: '赵六',
        username: 'player4',
        score: -50,
        position: 4,
        createdAt: '2024-01-20T10:30:00Z'
      }
    ]
  } catch (error) {
    console.error('加载成绩失败:', error)
    message.error('加载成绩失败')
  } finally {
    loading.value = false
  }
}

// 加载比赛列表
const loadCompetitions = async () => {
  try {
    // 这里应该调用实际的API来获取比赛列表
    competitions.value = [
      { id: 1, competitionName: '2024春季麻将个人赛' },
      { id: 2, competitionName: '2024春季麻将团队赛' }
    ]
  } catch (error) {
    console.error('加载比赛失败:', error)
  }
}

// 加载玩家列表
const loadPlayers = async () => {
  try {
    // 这里应该调用实际的API来获取玩家列表
    players.value = [
      { id: 1, username: 'player1', nickname: '张三' },
      { id: 2, username: 'player2', nickname: '李四' },
      { id: 3, username: 'player3', nickname: '王五' },
      { id: 4, username: 'player4', nickname: '赵六' }
    ]
  } catch (error) {
    console.error('加载玩家失败:', error)
  }
}

// 刷新成绩列表
const refreshResults = () => {
  loadResults()
}

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
}

// 比赛选择变化
const onCompetitionChange = (competitionId: number) => {
  // 这里可以根据选择的比赛加载相应的玩家列表
  console.log('选择的比赛ID:', competitionId)
}

// 添加成绩记录
const addResult = () => {
  createForm.results.push({ playerId: null, score: 0, position: createForm.results.length + 1 })
}

// 删除成绩记录
const removeResult = (index: number) => {
  createForm.results.splice(index, 1)
  // 重新计算名次
  createForm.results.forEach((result, idx) => {
    result.position = idx + 1
  })
}

// 查看成绩详情
const viewResult = (result: any) => {
  selectedResult.value = result
  showDetailModal.value = true
}

// 编辑成绩
const editResult = (result: any) => {
  message.info(`编辑成绩功能开发中：${result.playerName}`)
}

// 删除成绩
const deleteResult = async (result: any) => {
  try {
    // 这里应该调用实际的API来删除成绩
    const index = results.value.findIndex(r => r.id === result.id)
    if (index > -1) {
      results.value.splice(index, 1)
    }
    
    message.success(`已删除成绩：${result.playerName}`)
    
  } catch (error) {
    console.error('删除成绩失败:', error)
    message.error('操作失败')
  }
}

// 处理创建提交
const handleCreateSubmit = async () => {
  try {
    await createFormRef.value?.validate()
    
    createLoading.value = true
    
    // 这里应该调用实际的API来保存成绩
    // 目前使用模拟数据
    const newResults = createForm.results.map((result, index) => ({
      id: Date.now() + index,
      competitionId: createForm.competitionId,
      competitionName: competitions.value.find(c => c.id === createForm.competitionId)?.competitionName,
      roundNumber: createForm.roundNumber,
      playerId: result.playerId,
      playerName: players.value.find(p => p.id === result.playerId)?.nickname || players.value.find(p => p.id === result.playerId)?.username,
      username: players.value.find(p => p.id === result.playerId)?.username,
      score: result.score,
      position: result.position,
      createdAt: new Date().toISOString()
    }))
    
    results.value.push(...newResults)
    
    message.success('成绩保存成功')
    showCreateModal.value = false
    
    // 清空表单
    createForm.competitionId = null
    createForm.roundNumber = 1
    createForm.results = [{ playerId: null, score: 0, position: 1 }]
    
  } catch (error: any) {
    console.error('保存成绩失败:', error)
    message.error(error.message || '保存成绩失败')
  } finally {
    createLoading.value = false
  }
}

// 获取名次颜色
const getPositionColor = (position: number) => {
  const colorMap: Record<number, string> = {
    1: 'success',
    2: 'warning',
    3: 'info',
    4: 'error'
  }
  return colorMap[position] || 'default'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadResults()
  loadCompetitions()
  loadPlayers()
})
</script>

<style scoped>
.admin-match-results {
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

.search-section {
  margin-bottom: 24px;
}

.results-table {
  margin-bottom: 24px;
}

.results-input h4 {
  margin: 0 0 16px 0;
  color: #333;
}

.result-row {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 16px;
}

.result-detail {
  padding: 16px 0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.detail-item label {
  font-weight: bold;
  color: #333;
  min-width: 80px;
}

.detail-item span {
  color: #666;
}

.result-actions {
  text-align: center;
  margin-top: 16px;
}
</style>
