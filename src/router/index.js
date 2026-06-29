import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { isSupabaseConfigured } from '../lib/config'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/',
    component: () => import('../components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: 'board/:departmentId?',
        name: 'board',
        component: () => import('../views/BoardView.vue'),
      },
      {
        path: 'work-items/:id',
        name: 'work-item-detail',
        component: () => import('../views/WorkItemDetailView.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue'),
        meta: { requiresAdmin: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!isSupabaseConfigured()) return

  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.initialize()
  }

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login' }
  }

  if (to.meta.guest && auth.user) {
    return { name: 'dashboard' }
  }

  if (to.meta.requiresAdmin && auth.profile?.role !== 'admin') {
    return { name: 'dashboard' }
  }
})

export default router
