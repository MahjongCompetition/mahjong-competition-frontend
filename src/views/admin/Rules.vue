<template>
  <div class="admin-rules">
    <!-- 页面头部 -->
    <div class="page-header">
      <n-card>
        <div class="header-content">
          <div class="header-left">
            <h1>规则管理</h1>
            <p>管理系统中的所有比赛规则</p>
          </div>
          <div class="header-right">
            <n-button type="primary" @click="showCreateModal = true">
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
              创建规则
            </n-button>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <n-card>
        <n-space align="center" justify="space-between">
          <n-input
            v-model:value="searchKeyword"
            placeholder="搜索规则名称"
            style="width: 300px"
          >
            <template #prefix>
              <n-icon><Search /></n-icon>
            </template>
          </n-input>
          <n-button @click="refreshRules">
            <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
            刷新
          </n-button>
        </n-space>
      </n-card>
    </div>

    <!-- 规则列表 -->
    <div class="rules-table">
      <n-card>
        <n-data-table
          :columns="columns"
          :data="filteredRules"
          :loading="loading"
          :pagination="pagination"
          @update:page="handlePageChange"
        />
      </n-card>
    </div>

    <!-- 创建规则对话框 -->
    <n-modal v-model:show="showCreateModal" preset="card" title="创建规则" style="width: 600px">
      <n-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="规则名称" path="ruleName">
          <n-input v-model:value="createForm.ruleName" placeholder="请输入规则名称" />
        </n-form-item>
        <n-form-item label="初始分数" path="originPoints">
          <n-input-number
            v-model:value="createForm.originPoints"
            placeholder="请输入初始分数"
            :min="0"
            :max="10000"
          />
        </n-form-item>
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="第一名分数" path="firstPlacePoints">
              <n-input-number
                v-model:value="createForm.firstPlacePoints"
                placeholder="请输入第一名分数"
                :min="0"
                :max="10000"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="第二名分数" path="secondPlacePoints">
              <n-input-number
                v-model:value="createForm.secondPlacePoints"
                placeholder="请输入第二名分数"
                :min="0"
                :max="10000"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="第三名分数" path="thirdPlacePoints">
              <n-input-number
                v-model:value="createForm.thirdPlacePoints"
                placeholder="请输入第三名分数"
                :min="0"
                :max="10000"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="第四名分数" path="fourthPlacePoints">
              <n-input-number
                v-model:value="createForm.fourthPlacePoints"
                placeholder="请输入第四名分数"
                :min="0"
                :max="10000"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
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

    <!-- 编辑规则对话框 -->
    <n-modal v-model:show="showEditModal" preset="card" title="编辑规则" style="width: 600px">
      <n-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-placement="left"
        label-width="120"
      >
        <n-form-item label="规则名称" path="ruleName">
          <n-input v-model:value="editForm.ruleName" placeholder="请输入规则名称" />
        </n-form-item>
        <n-form-item label="初始分数" path="originPoints">
          <n-input-number
            v-model:value="editForm.originPoints"
            placeholder="请输入初始分数"
            :min="0"
            :max="10000"
          />
        </n-form-item>
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="第一名分数" path="firstPlacePoints">
              <n-input-number
                v-model:value="editForm.firstPlacePoints"
                placeholder="请输入第一名分数"
                :min="0"
                :max="10000"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="第二名分数" path="secondPlacePoints">
              <n-input-number
                v-model:value="editForm.secondPlacePoints"
                placeholder="请输入第二名分数"
                :min="0"
                :max="10000"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-grid :cols="2" :x-gap="16">
          <n-grid-item>
            <n-form-item label="第三名分数" path="thirdPlacePoints">
              <n-input-number
                v-model:value="editForm.thirdPlacePoints"
                placeholder="请输入第三名分数"
                :min="0"
                :max="10000"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="第四名分数" path="fourthPlacePoints">
              <n-input-number
                v-model:value="editForm.fourthPlacePoints"
                placeholder="请输入第四名分数"
                :min="0"
                :max="10000"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
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
import { competitionRuleApi } from '@/api/competition'
import type { CompetitionRule } from '@/api/competition'
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
const rules = ref<CompetitionRule[]>([])
const searchKeyword = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const createLoading = ref(false)
const editLoading = ref(false)
const editingRule = ref<CompetitionRule | null>(null)

// 表单引用
const createFormRef = ref()
const editFormRef = ref()

// 创建表单数据
const createForm = reactive({
  ruleName: '',
  originPoints: 1000,
  firstPlacePoints: 100,
  secondPlacePoints: 50,
  thirdPlacePoints: 0,
  fourthPlacePoints: -50
})

// 编辑表单数据
const editForm = reactive({
  ruleName: '',
  originPoints: 1000,
  firstPlacePoints: 100,
  secondPlacePoints: 50,
  thirdPlacePoints: 0,
  fourthPlacePoints: -50
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

// 表单验证规则
const createRules = {
  ruleName: [
    { required: true, message: '请输入规则名称', trigger: 'blur' },
    { min: 2, max: 50, message: '规则名称长度在2-50个字符之间', trigger: 'blur' }
  ],
  originPoints: [
    { required: true, message: '请输入初始分数', trigger: 'blur' }
  ],
  firstPlacePoints: [
    { required: true, message: '请输入第一名分数', trigger: 'blur' }
  ],
  secondPlacePoints: [
    { required: true, message: '请输入第二名分数', trigger: 'blur' }
  ],
  thirdPlacePoints: [
    { required: true, message: '请输入第三名分数', trigger: 'blur' }
  ],
  fourthPlacePoints: [
    { required: true, message: '请输入第四名分数', trigger: 'blur' }
  ]
}

const editRules = { ...createRules }

// 过滤后的规则列表
const filteredRules = computed(() => {
  if (!searchKeyword.value) return rules.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return rules.value.filter(rule => 
    rule.ruleName.toLowerCase().includes(keyword)
  )
})

// 表格列配置
const columns = [
  {
    title: '规则名称',
    key: 'ruleName',
    width: 200
  },
  {
    title: '初始分数',
    key: 'originPoints',
    width: 100
  },
  {
    title: '第一名',
    key: 'firstPlacePoints',
    width: 100,
    render: (row: CompetitionRule) => {
      const color = row.firstPlacePoints >= 0 ? 'success' : 'error'
      return h('n-tag', {
        type: color,
        size: 'small'
      }, { default: () => row.firstPlacePoints })
    }
  },
  {
    title: '第二名',
    key: 'secondPlacePoints',
    width: 100,
    render: (row: CompetitionRule) => {
      const color = row.secondPlacePoints >= 0 ? 'success' : 'error'
      return h('n-tag', {
        type: color,
        size: 'small'
      }, { default: () => row.secondPlacePoints })
    }
  },
  {
    title: '第三名',
    key: 'thirdPlacePoints',
    width: 100,
    render: (row: CompetitionRule) => {
      const color = row.thirdPlacePoints >= 0 ? 'success' : 'error'
      return h('n-tag', {
        type: color,
        size: 'small'
      }, { default: () => row.thirdPlacePoints })
    }
  },
  {
    title: '第四名',
    key: 'fourthPlacePoints',
    width: 100,
    render: (row: CompetitionRule) => {
      const color = row.fourthPlacePoints >= 0 ? 'success' : 'error'
      return h('n-tag', {
        type: color,
        size: 'small'
      }, { default: () => row.fourthPlacePoints })
    }
  },
  {
    title: '创建时间',
    key: 'createdAt',
    width: 150,
    render: (row: CompetitionRule) => formatDate(row.createdAt)
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    render: (row: CompetitionRule) => {
      return h('n-space', { size: 'small' }, {
        default: () => [
          h('n-button', {
            size: 'small',
            onClick: () => viewRule(row)
          }, { default: () => '查看', icon: () => h(Eye) }),
          h('n-button', {
            size: 'small',
            type: 'warning',
            onClick: () => editRule(row)
          }, { default: () => '编辑', icon: () => h(Edit) }),
          h('n-button', {
            size: 'small',
            type: 'error',
            onClick: () => deleteRule(row)
          }, { default: () => '删除', icon: () => h(Trash) })
        ]
      })
    }
  }
]

// 加载规则列表
const loadRules = async () => {
  try {
    loading.value = true
    rules.value = await competitionRuleApi.getAll()
  } catch (error) {
    console.error('加载规则失败:', error)
    message.error('加载规则失败')
  } finally {
    loading.value = false
  }
}

// 刷新规则列表
const refreshRules = () => {
  loadRules()
}

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
}

// 查看规则
const viewRule = (rule: CompetitionRule) => {
  message.info(`查看规则功能开发中：${rule.ruleName}`)
}

// 编辑规则
const editRule = (rule: CompetitionRule) => {
  editingRule.value = rule
  editForm.ruleName = rule.ruleName
  editForm.originPoints = rule.originPoints
  editForm.firstPlacePoints = rule.firstPlacePoints
  editForm.secondPlacePoints = rule.secondPlacePoints
  editForm.thirdPlacePoints = rule.thirdPlacePoints
  editForm.fourthPlacePoints = rule.fourthPlacePoints
  showEditModal.value = true
}

// 删除规则
const deleteRule = async (rule: CompetitionRule) => {
  try {
    await competitionRuleApi.delete(rule.id)
    message.success('规则删除成功')
    loadRules()
  } catch (error) {
    console.error('删除规则失败:', error)
    message.error('删除规则失败')
  }
}

// 处理创建提交
const handleCreateSubmit = async () => {
  try {
    await createFormRef.value?.validate()
    
    createLoading.value = true
    
    const ruleData = {
      ruleName: createForm.ruleName,
      originPoints: createForm.originPoints,
      firstPlacePoints: createForm.firstPlacePoints,
      secondPlacePoints: createForm.secondPlacePoints,
      thirdPlacePoints: createForm.thirdPlacePoints,
      fourthPlacePoints: createForm.fourthPlacePoints
    }
    
    await competitionRuleApi.create(ruleData)
    
    message.success('规则创建成功')
    showCreateModal.value = false
    loadRules()
    
    // 清空表单
    Object.assign(createForm, {
      ruleName: '',
      originPoints: 1000,
      firstPlacePoints: 100,
      secondPlacePoints: 50,
      thirdPlacePoints: 0,
      fourthPlacePoints: -50
    })
    
  } catch (error: any) {
    console.error('创建规则失败:', error)
    message.error(error.message || '创建规则失败')
  } finally {
    createLoading.value = false
  }
}

// 处理编辑提交
const handleEditSubmit = async () => {
  try {
    await editFormRef.value?.validate()
    
    if (!editingRule.value) return
    
    editLoading.value = true
    
    const ruleData = {
      ruleName: editForm.ruleName,
      originPoints: editForm.originPoints,
      firstPlacePoints: editForm.firstPlacePoints,
      secondPlacePoints: editForm.secondPlacePoints,
      thirdPlacePoints: editForm.thirdPlacePoints,
      fourthPlacePoints: editForm.fourthPlacePoints
    }
    
    await competitionRuleApi.update(editingRule.value.id, ruleData)
    
    message.success('规则更新成功')
    showEditModal.value = false
    loadRules()
    
  } catch (error: any) {
    console.error('更新规则失败:', error)
    message.error(error.message || '更新规则失败')
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
  loadRules()
})
</script>

<style scoped>
.admin-rules {
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

.rules-table {
  margin-bottom: 24px;
}
</style>
