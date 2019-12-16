import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/user',
    redirect: 'noRedirect',
    component: Layout,
    meta: { title: '用户', icon: 'user' },
    children: [
      {
        path: 'allUser',
        name: 'user',
        component: () => import('@/views/user/index'),
        children: [
          {
            path: '',
            name: 'display',
            component: () => import('@/views/user/components/userTable'),
            meta: { title: '所有用户', icon: 'dashboard' }
          },
          {
            path: 'edit',
            name: 'edit',
            component: () => import('@/views/user/profile'),
            hidden: true
          }
        ]
      },

      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/user/profile'),
        meta: { title: '我的个人信息', icon: 'dashboard' }
      }
   ]
  },
  {
    path: '/project',
    component: Layout,
    meta: { title: '项目管理', icon: 'form' },
    children: [
      {
        path: 'allProject',
        name: 'allProject',
        component: () => import('@/views/project/index'),
        children: [
          {
            path: '',
            name: 'all',
            component: () => import('@/views/project/components/projectTable'),
            meta: { title: '所有项目', icon: 'dashboard' },
          }
        ]
      },
      {
        path: 'addProject',
        name: 'addProject',
        component: () => import('@/views/project/project-add'),
        meta: { title: '添加项目', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/wish',
    name: 'wish',
    component: Layout,
    children: [
      {
        path: 'allWish',
        name: 'allWish',
        meta: { title: '寄语管理', icon: 'example'},
        component: () => import('@/views/wish/index')
      }
    ]
  },

  {
    path: '/dynamics',
    name: 'dynamics',
    component: Layout,
    meta: { title: '动态', icon: 'user' },
    children: [
      {
        path: 'allDynamics',
        name: 'allDynamics',
        component: () => import('@/views/dynamic/index'),
        meta: { title: '所有动态', icon: 'user' }      
      },
      {
        path: 'addDynamic',
        name: 'addDynamic',
        component: () => import('@/views/dynamic/profile'),
        meta: { title: '添加动态', icon: 'user' }
      },
      {
        path: 'edit',
        name: 'editDynamic',
        component: () => import('@/views/dynamic/profile'),
        meta: { title: '编辑', icon: 'user' },
        hidden: true
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
