import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getId } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
function setDisplay(children, roles) {
  if (!Array.isArray(children)) {
    return;
  }
  children.forEach(item => {
    if (!item.meta) {}
    else if (Array.isArray(item.meta.roles)) {
      let hidden = true;
      item.meta.roles.forEach(role => {
        if (roles.indexOf(role) === 0) {
          hidden = false;
        }
      })
      if (hidden) {
        item.hidden = true;
      } else {
        item.hidden = false;
      }
    }
    setDisplay(item.children, roles)
  })
}


NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {

  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const status = store.getters.status;
      if (status) {
        setDisplay(router.options.routes, [status]);
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          setDisplay(router.options.routes, [store.getters.status]);
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
