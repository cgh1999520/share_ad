const Home = () => import('../views/home.vue')

/* 认证相关 */
const Auth = () => import('../views/auth/auth.vue')

/* 主页相关 */
const IndexMap = () => import('../views/index/index-map.vue') // 主页地图
const IndexList = () => import('../views/index/index-list.vue') // 主页列表

/* 订单相关 */
const OrderManage = () => import('../views/order/order-manage.vue') // 订单管理
const OrderDetail = () => import('../views/order/order-detail.vue') // 订单详情

/* 账号相关 */
const Account = () => import('../views/account/account.vue') // 账号
const AccountInfo = () => import('../views/account/account-info.vue') // 账号信息
const AccountAuth = () => import('../views/account/account-auth.vue') // 账号认证
const SubAccount = () => import('../views/account/sub-account.vue') // 子账号管理
const FinanceManage = () => import('../views/account/finance-manage.vue') // 财务管理
const Tutorial = () => import('../views/account/tutorial.vue') // 使用教程
const Feedback = () => import('../views/account/feedback.vue') // 反馈

/* 投放流程 */
const ServingProcess = () => import('../views/serving/serving-process.vue') // 投放流程

/* 数据统计 */
const DataStatistices = () => import('../views/statistics/data-statistics.vue') // 数据统计

export default [
  {
    path: '',
    redirect: '/index'
  },
  {
    path: '/auth',
    name: Auth.name,
    component: Auth
  },
  {
    path: '/index',
    name: 'Index',
    component: Home,
    children: [
      {
        path: '',
        redirect: '/index/map'
      },
      {
        path: 'map',
        name: IndexMap.name,
        component: IndexMap
      }, {
        path: 'list',
        name: IndexList.name,
        component: IndexList
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    component: Home,
    children: [
      {
        path: '',
        name: OrderManage.name,
        component: OrderManage
      },
      {
        path: 'detail',
        name: OrderDetail.name,
        component: OrderDetail
      }
    ]
  },
  {
    path: '/account',
    name: 'Account',
    component: Home,
    children: [
      {
        path: '',
        name: Account.name,
        component: Account,
        redirect: '/account/info',
        children: [
          {
            path: 'info',
            name: AccountInfo.name,
            component: AccountInfo
          },
          {
            path: 'auth',
            name: AccountAuth.name,
            component: AccountAuth
          },
          {
            path: 'sub',
            name: SubAccount.name,
            component: SubAccount
          },
          {
            path: 'finance',
            name: FinanceManage.name,
            component: FinanceManage
          },
          {
            path: 'tutorial',
            name: Tutorial.name,
            component: Tutorial
          },
          {
            path: 'feedback',
            name: Feedback.name,
            component: Feedback
          }
        ]
      }
    ]
  },
  {
    path: '/serving',
    name: 'Serving',
    component: Home,
    children: [
      {
        path: '',
        name: ServingProcess.name,
        component: ServingProcess
      }
    ]
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Home,
    children: [
      {
        path: '',
        name: DataStatistices.name,
        component: DataStatistices
      }
    ]
  }
]
