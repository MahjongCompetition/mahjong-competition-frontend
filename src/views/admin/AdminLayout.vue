<template>
  <n-layout class="admin-layout">
    <!-- 侧边栏 -->
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div class="sidebar-header">
        <div class="logo">
          <n-icon size="32" color="#18a058">
            <Settings />
          </n-icon>
          <span v-show="!collapsed">管理面板</span>
        </div>
      </div>
      
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="activeKey"
        @update:value="handleMenuSelect"
      />
    </n-layout-sider>

    <!-- 主内容区域 -->
    <n-layout>
      <!-- 顶部导航栏 -->
      <n-layout-header bordered class="header">
        <div class="header-content">
          <div class="header-left">
            <n-button
              quaternary
              circle
              @click="collapsed = !collapsed"
            >
              <template #icon>
                <n-icon><Menu /></n-icon>
              </template>
            </n-button>
            <n-breadcrumb>
              <n-breadcrumb-item>管理面板</n-breadcrumb-item>
              <n-breadcrumb-item>{{ currentPageTitle }}</n-breadcrumb-item>
            </n-breadcrumb>
          </div>
          
          <div class="header-right">
            <n-space align="center">
              <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
                <n-button text>
                  <n-space align="center">
                    <n-avatar round size="small">
                      {{ authStore.currentAdmin?.name?.charAt(0) || 'A' }}
                    </n-avatar>
                    <span v-show="!collapsed">{{ authStore.currentAdmin?.name || '管理员' }}</span>
                    <n-icon><ChevronDown /></n-icon>
                  </n-space>
                </n-button>
              </n-dropdown>
            </n-space>
          </div>
        </div>
      </n-layout-header>

      <!-- 内容区域 -->
      <n-layout-content class="content">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { 
  Settings, 
  Menu, 
  ChevronDown, 
  DashboardOutline,
  TrophyOutline,
  PeopleOutline,
  DocumentTextOutline,
  BookOutline,
  PersonOutline
} from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const authStore = useAuthStore()

// 响应式数据
const collapsed = ref(false)

// 当前页面标题
const currentPageTitle = computed(() => {
  return route.meta.title || '管理面板'
})

// 当前激活的菜单项
const activeKey = computed(() => {
  return route.name as string
})

// 菜单选项
const menuOptions = [
  {
    label: '仪表盘',
    key: 'admin-dashboard',
    icon: renderIcon(DashboardOutline),
    path: '/admin'
  },
  {
    label: '比赛管理',
    key: 'admin-competitions',
    icon: renderIcon(TrophyOutline),
    path: '/admin/competitions'
  },
  {
    label: '玩家管理',
    key: 'admin-players',
    icon: renderIcon(PeopleOutline),
    path: '/admin/players'
  },
  {
    label: '成绩管理',
    key: 'admin-match-results',
    icon: renderIcon(DocumentTextOutline),
    path: '/admin/match-results'
  },
  {
    label: '规则管理',
    key: 'admin-rules',
    icon: renderIcon(BookOutline),
    path: '/admin/rules'
  },
  {
    label: '管理员管理',
    key: 'admin-admins',
    icon: renderIcon(PersonOutline),
    path: '/admin/admins'
  }
]

// 用户菜单选项
const userMenuOptions = [
  {
    label: '个人设置',
    key: 'settings'
  },
  {
    label: '返回用户端',
    key: 'back-to-user'
  },
  {
    label: '退出登录',
    key: 'logout'
  }
]

// 渲染图标
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  const menuItem = menuOptions.find(item => item.key === key)
  if (menuItem) {
    router.push(menuItem.path)
  }
}

// 处理用户菜单选择
const handleUserMenuSelect = (key: string) => {
  switch (key) {
    case 'settings':
      message.info('个人设置功能开发中...')
      break
    case 'back-to-user':
      router.push('/')
      break
    case 'logout':
      authStore.logoutAdmin()
      message.success('已退出登录')
      router.push('/admin/login')
      break
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #18a058;
}

.header {
  background: #fff;
  height: 64px;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.content {
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 64px);
}
</style>
