<template>
  <div class="admin-players">
    <!-- 页面头部 -->
    <div class="page-header">
      <n-card>
        <div class="header-content">
          <div class="header-left">
            <h1>玩家管理</h1>
            <p>管理系统中的所有麻将玩家</p>
          </div>
          <div class="header-right">
            <n-button @click="refreshPlayers">
              <template #icon>
                <n-icon><Refresh /></n-icon>
              </template>
              刷新
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
              v-model:value="filterStatus"
              :options="statusOptions"
              placeholder="选择玩家状态"
              style="width: 120px"
            />
            <n-input
              v-model:value="searchKeyword"
              placeholder="搜索玩家用户名、昵称或QQ"
              style="width: 300px"
            >
              <template #prefix>
                <n-icon><Search /></n-icon>
              </template>
            </n-input>
          </n-space>
          <n-space>
            <n-statistic label="总玩家数" :value="totalPlayers" />
            <n-statistic label="活跃玩家" :value="activePlayers" />
          </n-space>
        </n-space>
      </n-card>
    </div>

    <!-- 玩家列表 -->
    <div class="players-table">
      <n-card>
        <n-data-table
          :columns="columns"
          :data="filteredPlayers"
          :loading="loading"
          :pagination="pagination"
          @update:page="handlePageChange"
        />
      </n-card>
    </div>

    <!-- 玩家详情对话框 -->
    <n-modal v-model:show="showDetailModal" preset="card" title="玩家详情" style="width: 600px">
      <div v-if="selectedPlayer" class="player-detail">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <div class="detail-item">
              <label>用户名：</label>
              <span>{{ selectedPlayer.username }}</span>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>昵称：</label>
              <span>{{ selectedPlayer.nickname }}</span>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>QQ号：</label>
              <span>{{ selectedPlayer.qq }}</span>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>麻将ID：</label>
              <span>{{ selectedPlayer.mahjongId }}</span>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>麻将昵称：</label>
              <span>{{ selectedPlayer.mahjongNickname }}</span>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>账号状态：</label>
              <n-tag :type="selectedPlayer.isActive ? 'success' : 'error'" size="small">
                {{ selectedPlayer.isActive ? '正常' : '已禁用' }}
              </n-tag>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>注册时间：</label>
              <span>{{ formatDate(selectedPlayer.createdAt) }}</span>
            </div>
          </n-grid-item>
          <n-grid-item>
            <div class="detail-item">
              <label>最后登录：</label>
              <span>{{ formatDate(selectedPlayer.lastLoginTime) }}</span>
            </div>
          </n-grid-item>
        </n-grid>
        
        <n-divider />
        
        <div class="player-actions">
          <n-space>
            <n-button 
              :type="selectedPlayer.isActive ? 'error' : 'success'"
              @click="togglePlayerStatus(selectedPlayer)"
            >
              {{ selectedPlayer.isActive ? '禁用账号' : '启用账号' }}
            </n-button>
            <n-button type="warning" @click="resetPlayerPassword(selectedPlayer)">
              重置密码
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
import type { User } from '@/stores/auth'
import { 
  Search, 
  Refresh, 
  Eye, 
  Person 
} from '@vicons/ionicons5'

const message = useMessage()

// 响应式数据
const loading = ref(false)
const players = ref<User[]>([])
const filterStatus = ref<string>('')
const searchKeyword = ref('')
const showDetailModal = ref(false)
const selectedPlayer = ref<User | null>(null)

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
const statusOptions = [
  { label: '全部', value: '' },
  { label: '正常', value: 'active' },
  { label: '已禁用', value: 'inactive' }
]

// 统计数据
const totalPlayers = computed(() => players.value.length)
const activePlayers = computed(() => players.value.filter(p => p.isActive).length)

// 过滤后的玩家列表
const filteredPlayers = computed(() => {
  let result = players.value
  
  // 按状态过滤
  if (filterStatus.value) {
    if (filterStatus.value === 'active') {
      result = result.filter(p => p.isActive)
    } else if (filterStatus.value === 'inactive') {
      result = result.filter(p => !p.isActive)
    }
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => 
      p.username.toLowerCase().includes(keyword) ||
      p.nickname?.toLowerCase().includes(keyword) ||
      p.qq.includes(keyword)
    )
  }
  
  return result
})

// 表格列配置
const columns = [
  {
    title: '用户名',
    key: 'username',
    width: 150
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 150
  },
  {
    title: 'QQ号',
    key: 'qq',
    width: 120
  },
  {
    title: '麻将ID',
    key: 'mahjongId',
    width: 120
  },
  {
    title: '状态',
    key: 'isActive',
    width: 100,
    render: (row: User) => {
      return h('n-tag', {
        type: row.isActive ? 'success' : 'error',
        size: 'small'
      }, { default: () => row.isActive ? '正常' : '已禁用' })
    }
  },
  {
    title: '注册时间',
    key: 'createdAt',
    width: 150,
    render: (row: User) => formatDate(row.createdAt)
  },
  {
    title: '最后登录',
    key: 'lastLoginTime',
    width: 150,
    render: (row: User) => formatDate(row.lastLoginTime)
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render: (row: User) => {
      return h('n-space', { size: 'small' }, {
        default: () => [
          h('n-button', {
            size: 'small',
            onClick: () => viewPlayer(row)
          }, { default: () => '查看', icon: () => h(Eye) })
        ]
      })
    }
  }
]

// 加载玩家列表
const loadPlayers = async () => {
  try {
    loading.value = true
    // 这里应该调用实际的API来获取玩家列表
    // 目前使用模拟数据
    players.value = [
      {
        id: 1,
        username: 'player1',
        nickname: '张三',
        qq: '123456789',
        mahjongId: 'MJ001',
        mahjongNickname: '麻将高手',
        isActive: true,
        lastLoginTime: '2024-01-20T10:30:00Z',
        createdAt: '2024-01-01T09:00:00Z',
        updatedAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 2,
        username: 'player2',
        nickname: '李四',
        qq: '987654321',
        mahjongId: 'MJ002',
        mahjongNickname: '快乐麻将',
        isActive: true,
        lastLoginTime: '2024-01-19T15:20:00Z',
        createdAt: '2024-01-02T14:00:00Z',
        updatedAt: '2024-01-19T15:20:00Z'
      },
      {
        id: 3,
        username: 'player3',
        nickname: '王五',
        qq: '555666777',
        mahjongId: 'MJ003',
        mahjongNickname: '麻将新手',
        isActive: false,
        lastLoginTime: '2024-01-15T11:00:00Z',
        createdAt: '2024-01-03T16:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z'
      }
    ]
  } catch (error) {
    console.error('加载玩家失败:', error)
    message.error('加载玩家失败')
  } finally {
    loading.value = false
  }
}

// 刷新玩家列表
const refreshPlayers = () => {
  loadPlayers()
}

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.page = page
}

// 查看玩家详情
const viewPlayer = (player: User) => {
  selectedPlayer.value = player
  showDetailModal.value = true
}

// 切换玩家状态
const togglePlayerStatus = async (player: User) => {
  try {
    // 这里应该调用实际的API来切换玩家状态
    player.isActive = !player.isActive
    
    const action = player.isActive ? '启用' : '禁用'
    message.success(`已${action}玩家：${player.nickname || player.username}`)
    
  } catch (error) {
    console.error('切换玩家状态失败:', error)
    message.error('操作失败')
  }
}

// 重置玩家密码
const resetPlayerPassword = async (player: User) => {
  try {
    // 这里应该调用实际的API来重置密码
    message.success(`已重置玩家密码：${player.nickname || player.username}`)
    
  } catch (error) {
    console.error('重置密码失败:', error)
    message.error('操作失败')
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 生命周期
onMounted(() => {
  loadPlayers()
})
</script>

<style scoped>
.admin-players {
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

.players-table {
  margin-bottom: 24px;
}

.player-detail {
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

.player-actions {
  text-align: center;
  margin-top: 16px;
}
</style>
