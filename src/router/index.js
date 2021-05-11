import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})



export default router

router.beforeEach((to,from,next) => {
  const publicPages = ['/login']
  const isPrivatePage = !publicPages.includes(to.path)
  
  if(isPrivatePage && !sessionStorage.getItem('patoken')){
    return next({name:'Login'})
  } else {
    next()
  }
})
