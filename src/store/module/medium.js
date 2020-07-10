import {
  getComicTypeList, getLabelList,
  getMusicTypeList,
  getNovelTypeList,
  getSliceTimeList,
  getTopicList
} from '../../api/module/medium'

export default {
  namespaced: true,
  state: {
    topicList: [], // 话题列表
    labelList: [], // 标签列表
    musicTypeList: [], // 音乐类型列表
    novelTypeList: [], // 小说类型列表
    comicTypeList: [], // 小说类型列表
    sliceTimeList: [], // 切片时间列表
    displayPosition: [
      {key: 0, name: '社区广告'},
      {key: 1, name: '交友广告'},
      {key: 2, name: '系统公告'},
      {key: 3, name: '漫画广告'},
      {key: 4, name: '启动广告'}
    ], // 展示位置列表
    skipTypeList: [
      {key: 0, name: '详情'},
      {key: 1, name: 'app 下载链接'},
      {key: 2, name: '第三方链接'}
    ]// 跳转类型
  },
  getters: {
    // 获取 话题列表
    getTopicList: state => state.topicList,
    // 获取 标签列表
    getLabelList: state => state.labelList,
    // 获取 漫画类型列表
    getComicTypeList: state => state.comicTypeList,
    // 获取 小说类型列表
    getNovelTypeList: state => state.novelTypeList,
    // 获取 切片时间列表
    getSliceTimeList: state => state.sliceTimeList,
    // 获取 音乐类型列表
    getMusicTypeList: state => state.musicTypeList,
    // 获取 展示位置列表
    getDisplayPosition: state => state.displayPosition,
    // 获取跳转类型列表
    getSkipTypeList: state => state.skipTypeList
  },
  mutations: {
    // 设置 话题列表
    setTopicList (state, payload) {
      state.topicList = payload
    },
    // 设置 标签列表
    setLabelList (state, payload) {
      state.labelList = payload
    },
    // 设置 音乐类型列表
    setMusicTypeList (state, payload) {
      state.musicTypeList = payload
    },
    // 设置 漫画类型列表
    setComicTypeList (state, payload) {
      state.comicTypeList = payload
    },
    // 设置 小说类型列表
    setNovelTypeList (state, payload) {
      state.novelTypeList = payload
    },
    // 设置 切片时间列表
    setSliceTimeList (state, payload) {
      state.sliceTimeList = payload
    }
  },
  actions: {
    /**
     * @Description: 更新切片时间列表
     * @date 2019/8/20  10:13
     */
    updateSliceTimeList ({commit}) {
      getSliceTimeList().then(res => {
        commit('setSliceTimeList', res.rows)
      })
    },

    /**
     * @Description: 更新漫画类型列表
     * @date 2019/5/14  15:48
     */
    updateComicTypeList ({commit}) {
      // 获取漫画类型列表
      getComicTypeList().then(res => {
        commit('setComicTypeList', res)
      })
    },

    /**
     * @Description: 更新话题列表
     * @date 2019/5/14  15:48
     */
    updateTopicList ({commit}) {
      getTopicList({
        name: '',
        type: ''
      }).then(({rows}) => {
        commit('setTopicList', rows)
      })
    },

    /**
     * @Description: 更新标签列表
     * @date 2019/5/14  15:48
     */
    updateLabelList ({commit}) {
      getLabelList({
        name: '',
        videoType: ''
      }).then(({rows}) => {
        commit('setLabelList', rows)
      })
    },

    /**
     * @Description: 更新小说类型列表
     * @date 2019/5/14  15:48
     */
    updateNovelTypeList ({commit}) {
      // 获取小说类型列表
      getNovelTypeList().then(res => {
        commit('setNovelTypeList', res)
      })
    },
    /**
     * @Description: 更新音乐类型列表
     * @date 2019/5/14  15:48
     */
    updateMusicTypeList ({commit}) {
      // 获取音乐类型列表
      getMusicTypeList().then(res => {
        commit('setMusicTypeList', res)
      })
    }
  }
}
