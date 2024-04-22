export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/design/:id',
    name: 'Design',
    component: () => import('@/views/Design.vue')

  },
  {
    path: '/ss/:url',
    name: 'Design-SS',
    component: () => import('@/views/Design.vue')

  },
]
