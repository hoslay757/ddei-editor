// import {DDei} from 'ddei-framework'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => {
    history.pushState(null, null, document.URL)
  }
})
router.beforeEach((to, from) => {
  // if (from.name == 'Design') {
  //   for (let i in DDei.INSTANCE_POOL) {
  //     DDei.INSTANCE_POOL[i]?.render?.destroyed()
  //   }

  // }
  return true
})


export default router
