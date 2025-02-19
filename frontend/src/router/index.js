import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import HomePage from '@/views/HomePage.vue'
import SAdmin from '@/views/SAdmin.vue'
import ProfileCompletion from '@/views/ProfileCompletion.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
      meta: { 
        requiresAuth: true,
        roles: ['player']
      }
    },
    {
      path: '/super-admin',
      name: 'superAdmin',
      component: SAdmin,
      meta: { 
        requiresAuth: true,
        roles: ['superAdmin']
      }
    },
    {
      path: '/futsal-admin/profile-completion',
      name: 'futsalProfileCompletion',
      component: ProfileCompletion,
      meta: {
        requiresAuth: true,
        roles: ['futsalAdmin']
      }
    },
    {
      path: '/admin-dashboard',
      name: 'adminDashboard',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: {
        requiresAuth: true,
        roles: ['futsalAdmin'],
        requiresProfileCompletion: true
      }
    },
    {
      path: '/admin-courts',
      name: 'adminCourts',
      component: () => import('@/views/AdminCourts.vue'),
      meta: {
        requiresAuth: true,
        roles: ['futsalAdmin']
      }
    },
    {
      path: '/courts/:id',
      name: 'courtDetails',
      component: () => import('@/views/CourtDetails.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin-tournaments',
      name: 'adminTournaments',
      component: () => import('@/views/AdminTourny.vue'),
      meta: {
        requiresAuth: true,
        roles: ['futsalAdmin']
      }
    },

    {
      path: '/player/courts/:id',
      name: 'playerCourtDetails',
      component: () => import('@/views/PlayerCourtDetails.vue'),
      meta: { 
        requiresAuth: true,
        roles: ['player']
      }
    }    
    
  ]
})

// Navigation guard for auth and role checking
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  const profileCompleted = localStorage.getItem('profileCompleted') === 'true'

  console.log('Route Guard:', {
    to: to.path,
    isAuthenticated,
    userRole,
    profileCompleted
  });
  // First check authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Check role permissions
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/login')
    return
  }

  // Handle futsal admin profile completion
  if (userRole === 'futsalAdmin' && !profileCompleted) {
    // Allow access to profile completion page
    if (to.name === 'futsalProfileCompletion') {
      next()
      return
    }
    // Redirect to profile completion if trying to access other pages
    if (to.meta.requiresAuth) {
      next('/futsal-admin/profile-completion')
      return
    }
  }

  next()
})

export default router