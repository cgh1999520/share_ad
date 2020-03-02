<template>
  <Layout class="h-100b">

    <Header class="bg-white dis-flex align-item-center" style="box-shadow:0px 2px 9px 1px rgba(0, 0, 0, 0.1);z-index: 1;">
      <img src="../assets/images/logo-01.png" class="logo-img">
      <!--导航栏-->
      <div class="nav-box">
        <router-link
          v-for="(item, inx) of navList" :key="inx"
          :to="item.url">
          <div class="nav-item" :class="{'active-nav': isActiveNav(item)}">
            {{item.title}}
          </div>
        </router-link>
      </div>
      <!--左边操作按钮-->
      <div style="margin-left: auto;" class="color-6B71F3 dis-flex pos-relative align-item-center">
        <!--消息控件-->
          <message-control ref="messageControl"></message-control>

<!--          <div class="serving-count">昨日投放量：100cpm</div>-->
          <Badge :dot="isNotReadMsg">
            <button class="operating-bt" @click="showMessageDialog"><img src="../assets/images/nav/message.png"></button>
          </Badge>
          <router-link to="/account">
            <button class="operating-bt operating-bt-mg"><img src="../assets/images/nav/account.png"></button>
          </router-link>
          <router-link to="/auth">
            <button class="operating-bt"><img src="../assets/images/nav/exit.png"></button>
          </router-link>
      </div>
    </Header>
    <Content style="height: 0;">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </Content>
  </Layout>
</template>

<script>
import MessageControl from '@/components/message-control'
import {mapGetters} from 'vuex'
export default {
  name: 'index',
  components: {MessageControl},
  data () {
    return {
      navList: [
        {url: '/index', key: 'index', title: '首页'},
        {url: '/serving', key: 'serving', title: '投放流程'},
        {url: '/statistics', key: 'statistics', title: '数据统计'},
        {url: '/order', key: 'order', title: '订单管理'}
      ]
    }
  },
  computed: {
    ...mapGetters(['getMessageList']),
    /*
    * 是否有未读的消息
    * */
    isNotReadMsg () {
      return this.getMessageList.findIndex(item => item.isRead === 'no') !== -1
    }
  },
  methods: {
    /**
       * @Description: 是否选中 导航
       * @date 2019/8/7  16:14
       */
    isActiveNav (item) {
      return this.$route.path.indexOf(item.key) !== -1
    },
    /**
     * @Description: 显示 消息窗口
     * @date 2019/8/12  12:21
    */
    showMessageDialog () {
      if (!this.$refs.messageControl.isShowDialog) {
        this.$refs.messageControl.showDialog()
      } else {
        this.$refs.messageControl.closeDialog()
      }
    },
    isLoginNow (ind) {
      console.log(ind, 'index')
      if (ind === 'statistics') {
        return false
      }
    }
  }
}
</script>

<style scoped lang="less">

  /deep/ .ivu-layout-header {
    height: 50px;
    padding: 11px 34px;
    line-height: initial;
  }

  /*Logo 图片*/
  .logo-img {
    width: 112px;
    margin-right: 181px;
  }

  /*导航栏容器*/
  .nav-box {
    display: flex;

    /*导航栏 Item */

    .nav-item {
      color: #6B71F3;
      height: 100%;
      padding: 0 55px;
    }

    /*选中的 导航*/

    .active-nav {
      color: #5156C8;
      font-size: 16px;
      position: relative;

      /*公共线条*/
      .line {
        width: 16px;
        height: 2px;
        position: absolute;
        top: calc(50% - 1px);
        background-color: #6B71F3;
        content: "";
      }

      &:before {
        .line;
        left: 35px;
      }
      &:after {
        .line;
        right: 35px;
      }
    }
  }

  /*投放数量*/
  .serving-count {
    margin-right: 22px;
    padding-right: 22px;
    border-right: 1px solid #6B71F3;
  }

  /*操作按钮*/
  .operating-bt {
    background: none;
    border: none;
    cursor: pointer;

    &.operating-bt-mg {
      margin: auto 24px;
    }

    img {
      height: 17px;
    }
  }
</style>
