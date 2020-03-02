<template>
  <Card class="mes-box" v-if="isShowDialog">
    <div class="title">消息</div>
    <Scroll :on-reach-bottom="handleReachBottom" class="mes-content hidden-scroll">
      <div class="mes-content-item" v-for="item of getMessageList" :key="item.id">
        <div style="font-weight: bold;">
            <span
              v-if="item.isRead === 'no'"
              class="radius-50 dis-inline-block mg-right-10 bg-6B71F3"
              style="width: 9px; height: 9px;"></span>
          {{item.title}}
          <span class="float-right" style="font-weight: normal;font-size: 12px;">{{item.createTime}}</span>
        </div>
        <div class="dis-flex mg-top-10 align-item-center">
          <span class="flex-1">{{item.message}}</span>
          <div class="operation-box">
            <Icon type="ios-checkmark-circle-outline"
                  :style="{visibility: item.isRead === 'yes'
                   ? 'hidden' : ''}" @click="readMessage(item)" color="green"/>
            <Icon type="ios-close-circle-outline" @click="deleteMessage(item)" color="red"/>
          </div>
        </div>
      </div>
    </Scroll>
  </Card>
</template>

<script>
import DialogMixin from '@/mixins/dialog-mixin'
import {deleteMessage, setMessageRead} from '../api/module/account'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'message-control',
  mixins: [DialogMixin],
  computed: {
    ...mapGetters(['getMessageList'])
  },
  data () {
    return {
      page: 1
    }
  },
  watch: {
    isShowDialog (value) {
      if (value) {
        this.page = 1
        this.updateMessageList()
      }
    }
  },
  created () {
    this.updateMessageList()
  },
  methods: {
    ...mapActions(['updateMessageList']),
    /**
    * @Description: 滑动到底部加载更多
    * @date 2019/9/26
    */
    handleReachBottom () {
      console.log('测试')
      return new Promise((resolve, reject) => {
        this.page++
        this.updateMessageList(this.page).then(res => res.length > 0
          ? resolve(true) : reject(new Error('not have meaage')), err => reject(err))
      })
    },
    /**
             * @Description: 标记消息已读
             * @date 2019/9/19  15:45
             */
    readMessage (event) {
      setMessageRead({messageId: event.id}).then(() => this.updateMessageList())
    },
    /**
             * @Description: 删除消息
             * @date 2019/9/19  15:45
             */
    deleteMessage (event) {
      deleteMessage({id: event.id}).then(() => this.updateMessageList())
    }
  }
}
</script>

<style scoped lang="less">
  /deep/ .ivu-scroll-container {
    width: 100%;
  }
  /deep/ .ivu-scroll-container {
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
  /deep/ .ivu-scroll-container::-webkit-scrollbar { width: 0 !important }

  /deep/ .ivu-card-body {
    display: flex;
    flex-direction: column;
    height: 100% !important;
  }

  /*消息容器*/
  .mes-box {
    width: 444px;
    height: 280px;
    position: absolute;
    top: 33px;
    right: 34px;
    padding: 11px 24px;
  }

  /*标题*/
  .title {
    font-size: 16px;
    font-weight: 400;
    color: rgba(107, 113, 243, 1);
    padding-bottom: 12px;
    border-bottom: 1px solid #6B71F3;
  }

  /*消息内容*/
  .mes-content {
    width: 100%;
    flex: 1;
    overflow-y: auto;

    .mes-content-item {
      line-height: 20px;
      padding: 13px 5px;
      color: #808080;
      border-bottom: 1px solid #DBDBDB;
    }

    /*操作容器*/

    .operation-box {
      margin-left: 10px;
      padding-left: 10px;
      display: flex;
      align-items: center;
      border-left: 1px solid #916BF1;

      i {
        margin-left: 5px;
        font-size: 18px;
      }
    }
  }

  /deep/ .ivu-card-body {
    padding: 0;
  }
</style>
