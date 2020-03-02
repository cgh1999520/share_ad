<template>
  <Layout>
    <Header class="dis-flex align-item-center" style="background-color: #916BF1">
      <!-- Logo-->
      <img id="logo-img" src="../../assets/images/logo.png">
      <!--左边操作按钮-->
      <div style="margin-left: auto;" class="color-6B71F3 dis-flex align-item-center">
        <router-link to="/auth">
          <button class="serving-count color-white button">登录</button>
        </router-link>
        <router-link to="/auth?type=register">
          <button class="button color-white">注册</button>
        </router-link>
      </div>
    </Header>
    <Content class="pos-relative">

      <!--登录控件-->
      <login-control v-if="authType === 'login'" class="auth-control"></login-control>
      <!--注册控件-->
      <register-control v-if="authType === 'register'" class="auth-control"></register-control>
      <!--找回密码-->
      <retrieve-password-control v-if="authType === 'retrieve-pws'" class="auth-control"></retrieve-password-control>

      <Carousel
        v-model="setting.select"
        :autoplay="true"
        :autoplay-speed="setting.autoplaySpeed"
        :dots="setting.dots"
        :arrow="setting.arrow">
        <CarouselItem v-for="o of 500" :key="o">
          <div class="carousel-bg-img"></div>
        </CarouselItem>
      </Carousel>
    </Content>
  </Layout>
</template>

<script>
import LoginControl from '@/components/auth/login-control'
import RegisterControl from '@/components/auth/register-control'
import RetrievePasswordControl from '@/components/auth/retrieve-password-control'
export default {
  name: 'auth',
  components: {RetrievePasswordControl, RegisterControl, LoginControl},
  watch: {
    '$route' () {
      this.authType = this.$route.query.type || 'login'
    }
  },
  data () {
    return {
      // 轮播图设置
      setting: {
        select: 0,
        autoplaySpeed: 3000,
        dots: 'inside',
        arrow: 'never'
      },
      authType: ''
    }
  },
  created () {
    this.authType = this.$route.query.type || 'login'
  }
}
</script>

<style scoped lang="less">

  /deep/ .ivu-layout-header {
    padding: 11px 60px;
    line-height: initial;
  }

  /deep/ .ivu-input {
    border: none;
    height: 100%;
  }

  /deep/ .ivu-input-group-prepend, /deep/ .ivu-input-group-append {
    background: none;
    border: none;
  }
  /deep/ .ivu-input-group-prepend {
    width: 34px;
  }

  /deep/ .ivu-input-group {
    height: 41px;
    margin-top: 20px;
    border: 1px solid #e0e0e0;
  }

  /deep/ #auth-control-box {
    width: 331px;
    min-height: 341px;
    padding: 38px 42px;
    background-color: white;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.65);
  }

  /*找回密码*/
  /deep/ .retrieve-pws {
    color: #8959da;
    font-size: 10px;
    margin-left: auto;
    float: right;
    cursor: pointer;
  }

  /*账号导航栏*/
  /deep/ .auth-title {
    color: #292929;
    font-size: 16px;
    text-align: center;
    padding-bottom: 20px;
    cursor: pointer;
  }

  /*认证按钮*/
  /deep/ .auth-bt {
    width: 100%;
    background-color: #6222cd !important;
    border: none !important;
    border-radius: 0 !important;
    color: white;
    font-size: 18px !important;
  }

  /*改变轮播图默认样式*/
  /deep/ .ivu-carousel-dots {
    bottom: 50px;
  }

  /deep/ .ivu-carousel-dots li button {
    width: 45px;
    height: 9px;
    border-radius: 10px;
    background: #6222cd;
  }

  /* Logo */
  #logo-img {
    width: 126px;
  }

  /*轮播图背景图片*/
  .carousel-bg-img {
    width: 100vw;
    height: 100vh;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("../../assets/images/auth/auth-bg.png");
  }

  /*认证控件*/
  .auth-control {
    position: absolute;
    right: 60px;
    top: 0;
    z-index: 1;
  }

  /*投放数量*/
  .serving-count {
    margin-right: 10px;
    padding-right: 10px;
    border-right: 1px solid white;
  }

</style>
