/**
 * @Description: 权限相关
 * @date 2019/5/15  17:54
 */
import {getAuthorityList} from '../../api/module/authority'
import {routers} from '../../router/routers'
import {getRouterList} from '../../utils/utils'

export default {
  namespaced: true,
  state: {
    authorityList: [], // 权限列表
    authorityRouterList: [], // 认证路由列表
    authorityTypeList: [
      {key: 0, name: '目录'},
      {key: 1, name: '菜单'},
      {key: 2, name: '按钮'}
    ], // 权限类型
    sourceKeyList: [
      {key: 'add', name: '添加'},
      {key: 'edit', name: '编辑'},
      {key: 'delete', name: '删除'},
      {key: 'view', name: '查看'}
    ], // 权限标识类型
    pageSourceKeyList: {
      UserManage: [ // 用户管理
        {name: '绑定角色', key: 'bind-role'}
      ],
      MemberManage: [ // 会员管理
        {name: '设置推荐', key: 'recommend'},
        {name: '创建虚拟会员', key: 'virtual-member'},
        {name: '导出', key: 'export'},
        {name: '修改金币', key: 'edit-gold'},
        {name: '金币明细', key: 'gold-detail'},
        {name: '拉黑', key: 'black'},
        {name: '更新密码', key: 'update-pws'},
        {name: '编辑角色', key: 'edit-role'},
        {name: '编辑等级', key: 'edit-grade'}
      ],
      BlackMemberManage: [ // 黑名单会员管理
        {name: '金币明细', key: 'gold-detail'},
        {name: '取消拉黑', key: 'black'}
      ],
      MemberRoleManage: [ // 会员角色
        {name: '设置权限', key: 'authority'}
      ],
      RoleManage: [ // 角色设置
        {name: '设置权限', key: 'authority'}
      ],
      MusicManage: [ // 音乐设置
        {name: '设置推荐', key: 'recommend'}
      ],
      NovelManage: [ // 小说管理设置
        {name: '设置推荐', key: 'recommend'},
        {name: '查看章节', key: 'chapter'}
      ],
      ComicManage: [ // 漫画管理设置
        {name: '设置推荐', key: 'recommend'},
        {name: '查看章节', key: 'chapter'}
      ],
      PersonalManage: [ // 推广管理设置
        {name: '分享链接', key: 'share-link'},
        {name: 'h5 分享统计', key: 'share-statistics'},
        {name: '8级统计', key: 'level-statistics'},
        {name: '上下级', key: 'level'},
        {name: '推广详情', key: 'popularize-detail'}
      ],
      SharePopularizeManage: [ // H5 分享推广管理设置
        {name: '分享链接', key: 'share-link'},
        {name: '上下级', key: 'level'}
      ],
      PayChannelManage: [ // 支付渠道管理
        {name: '设置启用', key: 'enable'}
      ],
      AdManage: [ // 广告管理设置
        {name: '设置广告显示', key: 'ad-show'}
      ],
      ShortVideoManage: [ // 短视频管理设置
        {name: '查看评价', key: 'evaluate'},
        {name: '审核', key: 'auditing'},
        {name: '推荐', key: 'recommend'},
        {name: '设置短视频显示', key: 'show'}
      ],
      ShortVideoTypeManage: [ // 短视频类型管理设置
        {name: '推荐', key: 'recommend'}
      ],
      ImageTextManage: [ // 图文管理设置
        {name: '查看评价', key: 'evaluate'},
        {name: '审核', key: 'auditing'},
        {name: '推荐', key: 'recommend'},
        {name: '设置短视频显示', key: 'show'}
      ],
      ShortEssayManage: [ // 短文管理设置
        {name: '查看评价', key: 'evaluate'},
        {name: '审核', key: 'auditing'},
        {name: '推荐', key: 'recommend'},
        {name: '设置短视频显示', key: 'show'}
      ],
      WorkOrderManage: [ // 工单设置
        {name: '处理工单', key: 'work-order'}
      ],
      VipOrderManage: [ // Vip 订单管理
        {name: '导出订单', key: 'export-order'},
        {name: '提成详情', key: 'commission-detail'}
      ],
      RechargeOrderManage: [ // 充值订单管理
        {name: '导出订单', key: 'export-order'}
      ],
      UserGoldDetailManage: [ // 会员金币流水管理
        {name: '导出订单', key: 'export-order'},
        {name: '金币明细', key: 'gold-detail'}
      ],
      WithdrawOrderManage: [ // 提现订单管理
        {name: '导出订单', key: 'export-order'}
      ],
      GoldDetailManage: [ // 平台金币管理
        {name: '导出订单', key: 'export-order'}
      ],
      ViewWechatOrderManage: [ // 查看微信订单管理
        {name: '导出订单', key: 'export-order'}
      ],
      ViewPhoneOrderManage: [ // 查看手机号订单管理
        {name: '导出订单', key: 'export-order'}
      ],
      ChatOrderManage: [ // 聊天订单管理
        {name: '导出订单', key: 'export-order'}
      ],
      ShortVideoOrderManage: [ // 短视频订单管理
        {name: '导出订单', key: 'export-order'},
        {name: '提成详情', key: 'commission-detail'}
      ],
      NovelSubscribeManage: [ // 小说消费 订单管理
        {name: '导出订单', key: 'export-order'},
        {name: '提成详情', key: 'commission-detail'}
      ],
      ComicOrderManage: [ // 漫画消费 订单管理
        {name: '导出订单', key: 'export-order'},
        {name: '提成详情', key: 'commission-detail'}
      ],
      SelfieAuthReviewManage: [ //  自拍认证审核 管理
        {name: '审核', key: 'review'}
      ],
      AlbumReviewManage: [ // 影集审核管理
        {name: '审核', key: 'review'}
      ],
      WithdrawAuthReviewManage: [ // 提现认证审核管理
        {name: '审核', key: 'review'}
      ],
      HotSearchManage: [ // 影集审核管理
        {name: '显示热搜', key: 'show'},
        {name: '关闭热搜（不显示排行榜与搜索界面）', key: 'close'}
      ],
      LineManage: [ // 线路管理
        {name: '添加线路测试文件', key: 'add-line-test-file'}
      ],
      BackgroundImageManage: [ // 背景图片管理
        {name: '设置默认背景图片', key: 'default'}
      ],
      AppPackageManage: [ // IOS 包管理
        {name: '启用包', key: 'enable'},
        {name: '内容开关', key: 'content'}
      ]
    }// 默认界面可用按钮，作为
  },
  getters: {
    // 获取权限类型列表
    getAuthorityTypeList: state => state.authorityTypeList,
    // 获取权限标识列表
    getSourceKeyList: state => state.sourceKeyList,
    // 获取权限列表
    getAuthorityList: state => state.authorityList,
    // 获取界面可操作按钮列表
    getPageSourceKeyList: state => state.pageSourceKeyList,
    // 获取权限路由列表
    getAuthorityRouterList: state => state.authorityRouterList
  },
  mutations: {
    // 设置权限列表数据
    setAuthorityList (state, payload) {
      state.authorityList = payload
    },
    // 设置权限路由列表
    setAuthorityRouterList (state, payload) {
      state.authorityRouterList = payload
    }
  },
  actions: {
    /**
     * @Description: 更新 权限列表数据
     * @date 2019/5/15  20:04
     */
    updateAuthorityList ({commit}) {
      // 返回 Promise 异步处理
      return new Promise((resolve, reject) => {
        getAuthorityList().then(res => {
          commit('setAuthorityList', res)
          resolve(res)
        }).catch(err => reject(err))
      })
    },
    /**
     * @Description: 更新 权限路由列表
     * @date 2019/5/16  10:37
    */
    updateAuthorityRouterList ({commit}) {
      commit('setAuthorityRouterList', getRouterList(routers))
    }
  }
}
