import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import HomePage from '@/views/HomePage.vue'

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
        roles: ['player']  // Only allow players
      }
    }
  ]
})

// Navigation guard for auth and role checking
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') 
  const userRole = localStorage.getItem('userRole') 

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    // If user's role doesn't match required roles
    next('/login')
  } else {
    next()
  }
})

export default router