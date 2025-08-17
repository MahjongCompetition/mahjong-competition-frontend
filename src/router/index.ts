import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 用户端路由
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/user/Home.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/competitions',
      name: 'competitions',
      component: () => import('@/views/user/Competitions.vue'),
      meta: { title: '比赛列表' }
    },
    {
      path: '/competition/:id',
      name: 'competition-detail',
      component: () => import('@/views/user/CompetitionDetail.vue'),
      meta: { title: '比赛详情' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/user/Profile.vue'),
      meta: { title: '个人中心', requiresAuth: true }
    },
    {
      path: '/teams',
      name: 'teams',
      component: () => import('@/views/user/Teams.vue'),
      meta: { title: '团队管理', requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/user/Login.vue'),
      meta: { title: '用户登录' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/user/Register.vue'),
      meta: { title: '用户注册' }
    },
    
    // 管理员端路由
    {
      path: '/admin',
      name: 'admin-layout',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { title: '管理员', requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
          meta: { title: '管理面板' }
        },
        {
          path: 'login',
          name: 'admin-login',
          component: () => import('@/views/admin/Login.vue'),
          meta: { title: '管理员登录' }
        },
        {
          path: 'competitions',
          name: 'admin-competitions',
          component: () => import('@/views/admin/Competitions.vue'),
          meta: { title: '比赛管理' }
        },
        {
          path: 'players',
          name: 'admin-players',
          component: () => import('@/views/admin/Players.vue'),
          meta: { title: '玩家管理' }
        },
        {
          path: 'match-results',
          name: 'admin-match-results',
          component: () => import('@/views/admin/MatchResults.vue'),
          meta: { title: '成绩管理' }
        },
        {
          path: 'rules',
          name: 'admin-rules',
          component: () => import('@/views/admin/Rules.vue'),
          meta: { title: '规则管理' }
        },
        {
          path: 'admins',
          name: 'admin-admins',
          component: () => import('@/views/admin/Admins.vue'),
          meta: { title: '管理员管理' }
        }
      ]
    },
    
    // 404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: { title: '页面未找到' }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 设置页面标题
  document.title = `${to.meta.title || '麻将比赛系统'}`
  
  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/admin/login')
    return
  }
  
  // 检查是否需要用户登录
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }
  
  next()
})

export default router
