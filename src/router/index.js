import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import iView from 'iview'

Vue.use(Router)
const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to, 'to')
  let token = sessionStorage.getItem('token') || ' '
  if (to.path === '/statistics' && token === ' ') {
    iView.Modal.confirm({
      title: '温馨提示:',
      content: '该功能需要登录后才可使用!',
      okText: '去登录',
      onOk: () => {
        next({
          path: '/auth'
        })
      }
    })
  } else if (to.path === '/order' && token === ' ') {
    iView.Modal.confirm({
      title: '温馨提示:',
      content: '该功能需要登录后才可使用!',
      okText: '去登录',
      onOk: () => {
        next({
          path: '/auth'
        })
      }
    })
  } else if (to.path === '/account/info' && token === ' ') {
    iView.Modal.confirm({
      title: '温馨提示:',
      content: '该功能需要登录后才可使用!',
      okText: '去登录',
      onOk: () => {
        next({
          path: '/auth'
        })
      }
    })
  } else {
    next()
  }
//   iView.LoadingBar.start()
//   // 如果不存在token 则跳转到登录页
//   if (!sessionStorage.token && to.path !== '/auth') {
//     // iView.Message.error('请先登录')
//     next({
//       path: '/auth'
//     })
//   } else {
//     next()
//   }
})

// router.afterEach(() => {
//   iView.LoadingBar.finish()
//   window.scrollTo(0, 0)
// })

export default router
