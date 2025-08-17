<template>
  <div class="admin-competitions">
    <!-- 页面头部 -->
    <div class="page-header">
      <n-card>
        <div class="header-content">
          <div class="header-left">
            <h1>比赛管理</h1>
            <p>管理系统中的所有麻将比赛</p>
          </div>
          <div class="header-right">
            <n-button type="primary" @click="showCreateModal = true">
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
              创建比赛
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
              v-model:value="filterType"
              :options="typeOptions"
              placeholder="选择比赛类型"
              style="width: 120px"
            />
            <n-select
              v-model:value="filterStatus"
              :options="statusOptions"
              placeholder="选择比赛状态"
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
          <n-button @click="refreshCompetitions">
            <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
            刷新
          </n-button>
        </n-space>
      </n-card>
    </div>

    <!-- 比赛列表 -->
    <div class="competitions-table">
      <n-card>
        <n-data-table
          :columns="columns"
          :data="filteredCompetitions"
          :loading="loading"
          :pagination="pagination"
          @update:page="handlePageChange"
        />
      </n-card>
    </div>

    <!-- 创建比赛对话框 -->
    <n-modal v-model:show="showCreateModal" preset="card" title="创建比赛" style="width: 600px">
      <n-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="比赛名称" path="name">
          <n-input v-model:value="createForm.name" placeholder="请输入比赛名称" />
        </n-form-item>
        <n-form-item label="比赛描述" path="description">
          <n-input
            v-model:value="createForm.description"
            type="textarea"
            placeholder="请输入比赛描述"
            :rows="3"
          />
        </n-form-item>
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="比赛类型" path="type">
              <n-select
                v-model:value="createForm.type"
                :options="typeOptions"
                placeholder="选择比赛类型"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="最大人数" path="maxParticipants">
              <n-input-number
                v-model:value="createForm.maxParticipants"
                placeholder="请输入最大人数"
                :min="1"
                :max="100"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="报名开始时间" path="registrationStartTime">
              <n-date-picker
                v-model:value="createForm.registrationStartTime"
                type="datetime"
                placeholder="选择报名开始时间"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="报名截止时间" path="registrationEndTime">
              <n-date-picker
                v-model:value="createForm.registrationEndTime"
                type="datetime"
                placeholder="选择报名截止时间"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="比赛开始时间" path="startTime">
              <n-date-picker
                v-model:value="createForm.startTime"
                type="datetime"
                placeholder="选择比赛开始时间"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="比赛结束时间" path="endTime">
              <n-date-picker
                v-model:value="createForm.endTime"
                type="datetime"
                placeholder="选择比赛结束时间"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-form-item label="比赛规则" path="ruleId">
          <n-select
            v-model:value="createForm.ruleId"
            :options="ruleOptions"
            placeholder="选择比赛规则"
            filterable
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showCreateModal = false">取消</n-button>
          <n-button type="primary" :loading="createLoading" @click="handleCreateSubmit">
            创建
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 编辑比赛对话框 -->
    <n-modal v-model:show="showEditModal" preset="card" title="编辑比赛" style="width: 600px">
      <n-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="比赛名称" path="name">
          <n-input v-model:value="editForm.name" placeholder="请输入比赛名称" />
        </n-form-item>
        <n-form-item label="比赛描述" path="description">
          <n-input
            v-model:value="editForm.description"
            type="textarea"
            placeholder="请输入比赛描述"
            :rows="3"
          />
        </n-form-item>
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="比赛类型" path="type">
              <n-select
                v-model:value="editForm.type"
                :options="typeOptions"
                placeholder="选择比赛类型"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="最大人数" path="maxParticipants">
              <n-input-number
                v-model:value="editForm.maxParticipants"
                placeholder="请输入最大人数"
                :min="1"
                :max="100"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="报名开始时间" path="registrationStartTime">
              <n-date-picker
                v-model:value="editForm.registrationStartTime"
                type="datetime"
                placeholder="选择报名开始时间"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="报名截止时间" path="registrationEndTime">
              <n-date-picker
                v-model:value="editForm.registrationEndTime"
                type="datetime"
                placeholder="选择报名截止时间"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="比赛开始时间" path="startTime">
              <n-date-picker
                v-model:value="editForm.startTime"
                type="datetime"
                placeholder="选择比赛开始时间"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="比赛结束时间" path="endTime">
              <n-date-picker
                v-model:value="editForm.endTime"
                type="datetime"
                placeholder="选择比赛结束时间"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-form-item label="比赛规则" path="ruleId">
          <n-select
            v-model:value="editForm.ruleId"
            :options="ruleOptions"
            placeholder="选择比赛规则"
            filterable
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showEditModal = false">取消</n-button>
          <n-button type="primary" :loading="editLoading" @click="handleEditSubmit">
            保存
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h } from 'vue'
import { useMessage } from 'naive-ui'
import { competitionApi, competitionRuleApi } from '@/api/competition'
import type { Competition, CompetitionRule } from '@/api/competition'
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
const competitions = ref<Competition[]>([])
const rules = ref<CompetitionRule[]>([])
const filterType = ref<string>('')
const filterStatus = ref<string>('')
const searchKeyword = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const createLoading = ref(false)
const editLoading = ref(false)
const editingCompetition = ref<Competition | null>(null)

// 表单引用
const createFormRef = ref()
const editFormRef = ref()

// 创建表单数据
const createForm = reactive({
  name: '',
  description: '',
  type: 'INDIVIDUAL' as 'INDIVIDUAL' | 'TEAM',
  maxParticipants: 32,
  registrationStartTime: null as number | null,
  registrationEndTime: null as number | null,
  startTime: null as number | null,
  endTime: null as number | null,
  ruleId: null as number | null
})

// 编辑表单数据
const editForm = reactive({
  name: '',
  description: '',
  type: 'INDIVIDUAL' as 'INDIVIDUAL' | 'TEAM',
  maxParticipants: 32,
  registrationStartTime: null as number | null,
  registrationEndTime: null as number | null,
  startTime: null as number | null,
  endTime: null as number | null,
  ruleId: null as number | null
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
const typeOptions = [
  { label: '个人赛', value: 'INDIVIDUAL' },
  { label: '团队赛', value: 'TEAM' }
]

const statusOptions = [
  { label: '全部', value: '' },
  { label: '报名中', value: 'REGISTERING' },
  { label: '报名截止', value: 'REGISTRATION_CLOSED' },
  { label: '进行中', value: 'IN_PROGRESS' },
  { label: '已结束', value: 'FINISHED' }
]

const ruleOptions = computed(() => {
  return rules.value.map(rule => ({
    label: rule.ruleName,
    value: rule.id
  }))
})

// 过滤后的比赛列表
const filteredCompetitions = computed(() => {
  let result = competitions.value
  
  // 按类型过滤
  if (filterType.value) {
    result = result.filter(c => c.competitionType === filterType.value)
  }
  
  // 按状态过滤
  if (filterStatus.value) {
    if (filterStatus.value === 'REGISTERING') {
      result = result.filter(c => !c.registrationClosed)
    } else if (filterStatus.value === 'REGISTRATION_CLOSED') {
      result = result.filter(c => c.registrationClosed)
    }
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

// 表格列配置
const columns = [
  {
    title: '比赛名称',
    key: 'competitionName',
    width: 200
  },
  {
    title: '类型',
    key: 'competitionType',
    width: 100,
    render: (row: Competition) => {
      return h('n-tag', {
        type: row.competitionType === 'TEAM' ? 'success' : 'info',
        size: 'small'
      }, { default: () => row.competitionType === 'TEAM' ? '团队赛' : '个人赛' })
    }
  },
  {
    title: '最大人数',
    key: 'maxParticipants',
    width: 100
  },
  {
    title: '报名状态',
    key: 'registrationClosed',
    width: 100,
    render: (row: Competition) => {
      return h('n-tag', {
        type: row.registrationClosed ? 'error' : 'success',
        size: 'small'
      }, { default: () => row.registrationClosed ? '已截止' : '报名中' })
    }
  },
  {
    title: '报名截止',
    key: 'registrationDeadline',
    width: 150,
    render: (row: Competition) => formatDate(row.registrationDeadline)
  },
  {
    title: '比赛时间',
    key: 'startTime',
    width: 150,
    render: (row: Competition) => formatDate(row.startTime)
  },
  {
    title: '规则',
    key: 'rule',
    width: 120,
    render: (row: Competition) => row.rule?.ruleName || '-'
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    render: (row: Competition) => {
      return h('n-space', { size: 'small' }, {
        default: () => [
          h('n-button', {
            size: 'small',
            onClick: () => viewCompetition(row)
          }, { default: () => '查看', icon: () => h(Eye) }),
          h('n-button', {
            size: 'small',
            type: 'warning',
            onClick: () => editCompetition(row)
          }, { default: () => '编辑', icon: () => h(Edit) }),
          h('n-button', {
            size: 'small',
            type: 'error',
            onClick: () => deleteCompetition(row)
          }, { default: () => '删除', icon: () => h(Trash) })
        ]
      })
    }
  }
]

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

// 加载规则列表
const loadRules = async () => {
  try {
    rules.value = await competitionRuleApi.getAll()
  } catch (error) {
    console.error('加载规则失败:', error)
  }
}

// 刷新比赛列表
const refreshCompetitions = () => {
  loadCompetitions()
}

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
}

// 查看比赛
const viewCompetition = (competition: Competition) => {
  message.info(`查看比赛功能开发中：${competition.competitionName}`)
}

// 编辑比赛
const editCompetition = (competition: Competition) => {
  editingCompetition.value = competition
  editForm.name = competition.competitionName
  editForm.description = competition.description
  editForm.type = competition.competitionType
  editForm.maxParticipants = competition.maxParticipants
  editForm.ruleId = competition.rule.id
  // 这里需要转换时间格式
  showEditModal.value = true
}

// 删除比赛
const deleteCompetition = async (competition: Competition) => {
  try {
    await competitionApi.delete(competition.id)
    message.success('比赛删除成功')
    loadCompetitions()
  } catch (error) {
    console.error('删除比赛失败:', error)
    message.error('删除比赛失败')
  }
}

// 处理创建提交
const handleCreateSubmit = async () => {
  try {
    await createFormRef.value?.validate()
    
    createLoading.value = true
    
    // 这里需要转换时间格式
    const competitionData = {
      name: createForm.name,
      description: createForm.description,
      type: createForm.type,
      maxParticipants: createForm.maxParticipants,
      registrationStartTime: createForm.registrationStartTime,
      registrationEndTime: createForm.registrationEndTime,
      startTime: createForm.startTime,
      endTime: createForm.endTime,
      ruleId: createForm.ruleId
    }
    
    await competitionApi.create(competitionData)
    
    message.success('比赛创建成功')
    showCreateModal.value = false
    loadCompetitions()
    
    // 清空表单
    Object.assign(createForm, {
      name: '',
      description: '',
      type: 'INDIVIDUAL',
      maxParticipants: 32,
      registrationStartTime: null,
      registrationEndTime: null,
      startTime: null,
      endTime: null,
      ruleId: null
    })
    
  } catch (error: any) {
    console.error('创建比赛失败:', error)
    message.error(error.message || '创建比赛失败')
  } finally {
    createLoading.value = false
  }
}

// 处理编辑提交
const handleEditSubmit = async () => {
  try {
    await editFormRef.value?.validate()
    
    if (!editingCompetition.value) return
    
    editLoading.value = true
    
    // 这里需要转换时间格式
    const competitionData = {
      name: editForm.name,
      description: editForm.description,
      type: editForm.type,
      maxParticipants: editForm.maxParticipants,
      registrationStartTime: editForm.registrationStartTime,
      registrationEndTime: editForm.registrationEndTime,
      startTime: editForm.startTime,
      endTime: editForm.endTime,
      ruleId: editForm.ruleId
    }
    
    await competitionApi.update(editingCompetition.value.id, competitionData)
    
    message.success('比赛更新成功')
    showEditModal.value = false
    loadCompetitions()
    
  } catch (error: any) {
    console.error('更新比赛失败:', error)
    message.error(error.message || '更新比赛失败')
  } finally {
    editLoading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadCompetitions()
  loadRules()
})
</script>

<style scoped>
.admin-competitions {
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

.competitions-table {
  margin-bottom: 24px;
}
</style>
