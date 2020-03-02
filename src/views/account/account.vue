<template>
  <Layout class="h-100b">

    <!--修改密码控件-->
    <update-password-dialog ref="updatePassword">
    </update-password-dialog>

    <Sider hide-trigger class="bg-white hidden-scroll"
           style="overflow-y: auto;box-shadow:2px 0px 9px 1px rgba(0, 0, 0, 0.1);" width="372">
      <!--用户信息-->
      <div class="user-info tx-center">
        <div class="avatar-box">
          <img class="avatar" src="../../assets/images/auth/auth-bg.png"/>
        </div>

        <div class="color-333333" style="font-size: 18px;margin: 13px auto 8px;">{{getUserInfo.nickName}}</div>
        <Button class="edit-password-bt" @click="$refs.updatePassword.showDialog()">
          <Icon type="ios-create-outline"/>
          修改密码
        </Button>

        <!--底部资产信息-->
        <div class="dis-flex assets-box">
<!--          <div>
            <img src="../../assets/images/account/account.png">
            <div class="color-333333">
              50
              <p class="font-12">子账号数量</p>
            </div>
          </div>-->
          <div>
            <img src="../../assets/images/account/balance.png">
            <div class="color-333333">
              {{getBalanceMoney}}
              <p class="font-12">账户余额</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 导航栏 -->
      <div class="nav-menu-box">
        <router-link
          v-for="(item, inx) of navMenus"
          :key="inx"
          :to="'/account/' + item.key"
        >
          <div class="menu-item"
               :class="{'menu-item-active': item.key === selectNavMenu}">
            <img :src="item.key === selectNavMenu ? item.sImg : item.img">
            <div> {{item.title}}</div>
          </div>
        </router-link>
      </div>
    </Sider>
    <Content style="padding: 40px;" class="bg-white">

      <div>
        <div class="color-4D4D4D" style="font-size: 22px;">
        <span style="width: 9px;height: 9px;"
              class="radius-50 dis-inline-block mg-right-10 bg-6B71F3"></span>
          数据统计
        </div>

        <div class="dis-flex statistics-box">
          <div class="card-item">
            <div class="count">
              暂无此数据
              <p class="title">子账号数量</p>
            </div>
            <img src="../../assets/images/account/statistics-account.png">
          </div>
          <div class="card-item" style="margin: auto 40px;">
            <div class="count">
              {{getBalanceMoney}}
              <p class="title">账户余额</p>
            </div>
            <img src="../../assets/images/account/statistics-balance.png">
          </div>
          <div class="card-item">
            <div class="count">
              {{userDetail.completedOrderNumber}}
              <p class="title">完成订单数</p>
            </div>
            <img src="../../assets/images/account/statistics-order.png">
          </div>
        </div>
      </div>
      <router-view></router-view>
    </Content>
  </Layout>
</template>

<script>
import UpdatePasswordDialog from '@/components/account/update-password-dialog'
import {mapGetters, mapActions} from 'vuex'
import {getUserDetail} from '../../api/module/account'
// import {getUserBalance} from '../../api/module'

export default {
  name: 'account',
  components: {UpdatePasswordDialog},
  data () {
    return {
      navMenus: [
        {
          title: '账号信息',
          img: require('../../assets/images/account/nav-account.png'),
          sImg: require('../../assets/images/account/nav-account-sel.png'),
          key: 'info'
        },
        {
          title: '账号认证',
          key: 'auth',
          img: require('../../assets/images/account/nav-auth.png'),
          sImg: require('../../assets/images/account/nav-auth-sel.png')
        },
        /*        {
          title: '子账号管理',
          key: 'sub',
          img: require('../../assets/images/account/nav-child.png'),
          sImg: require('../../assets/images/account/nav-child-sel.png')
        }, */
        {
          title: '财务管理',
          key: 'finance',
          img: require('../../assets/images/account/nav-finance.png'),
          sImg: require('../../assets/images/account/nav-finance-sel.png')
        },
        {
          title: '使用教程',
          key: 'tutorial',
          img: require('../../assets/images/account/nav-tutorial.png'),
          sImg: require('../../assets/images/account/nav-tutorial-sel.png')
        },
        {
          title: '意见反馈',
          key: 'feedback',
          img: require('../../assets/images/account/nav-feedback.png'),
          sImg: require('../../assets/images/account/nav-feedback-sel.png')
        }
      ],
      userDetail: []
    }
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getBalanceMoney']),
    /**
       * @Description: 返回选中的 菜单
       * @date 2019/8/12  17:00
       */
    selectNavMenu () {
      let path = this.$route.path.split('/')
      return path[path.length - 1]
    }
  },
  mounted () {
    this.getMoney()
    this.updataBalanceMoney()
  },
  methods: {
    ...mapActions(['updataBalanceMoney']),
    // 获取余额
    getMoney () {
      getUserDetail().then(res => {
        console.log('用户详情', res)
        this.userDetail = res
      })
    }
  }
}
</script>

<style scoped lang="less">
  /*用户信息*/
  .user-info {
    margin: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid #E6E6E6;

    .avatar-box {
      width: 171px;
      height: 157px;
      padding: 17px;
      margin-top: 24px;
      background-image: url("../../assets/images/account/avatar-bg.png");
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;

      .avatar {
        width: 136px;
        height: 136px;
        border-radius: 50%;
      }
    }

    /*修改密码*/

    .edit-password-bt {
      background: none;
      border: none;

      i {
        color: #6B71F3;
      }

      font-size: 12px;
      color: #999999;
    }

    /*资产信息*/

    .assets-box {
      width: 100%;
      padding: 30px 0;

      > div {
        display: flex;
        flex: 1;
        align-items: center;
      }

      img {
        width: 28px;
        height: 21px;
        margin-right: 25px;
      }
    }
  }

  /*导航栏*/
  .nav-menu-box {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;

    .menu-item {
      width: 134px;
      height: 152px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #6B71F3;
      transition: all .5s;

      img {
        width: 40px;
        height: 40px;
        margin-bottom: 14px;
      }

      &.menu-item-active {
        background: rgba(107, 113, 243, 1);
        border-radius: 6px;
        color: white;
      }
    }
  }

  /*统计 容器*/
  .statistics-box {
    margin-top: 36px;
    margin-bottom: 50px;

    /* 卡片容器*/

    .card-item {
      display: flex;
      align-items: center;
      padding: 39px 44px;
      box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
      flex: 1;
      background: white;

      .count {
        color: #4D4D4D;
        font-size: 36px;
      }

      .title {
        color: #808080;
        margin-top: 21px;
      }

      img {
        width: 64px;
        height: 48px;
        margin-left: auto;
      }
    }
  }
</style>
