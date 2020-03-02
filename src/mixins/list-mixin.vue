<script>
import {commonDeleteRecord, commonGetList} from '../api/module/common'
import {copyObj, dataFilterReform} from '../utils/utils'
import CommonMixin from './common-mixin'
import lodash from 'lodash'

export default {
  name: 'list-mixin',
  mixins: [CommonMixin],
  data () {
    return {
      listTotal: 0, // 当前列表总数
      tableLoading: true, // table 加载中效果
      filterData: {}, // 需要过滤的数据
      listParams: { // 请求列表默认参数
        pageNumber: 1,
        pageSize: 15
      },
      searchParams: {}, // 搜索列表参数 为什么需要建两个呢？
      // （因为listParams 的参数部分会双向绑定，如果不使用两个的话，当有筛选项改变时，又切换页码就会出现带参搜索了）
      listData: [], // 列表请求数据
      baseListUrl: '' // 共用的列表请求地址
    }
  },
  beforeMount () {
    // 如果页码存在的话, 并且当前是界面，则初始化页码
    this.listParams.pageNumber = this.$route.query.page || 1
    // 初始化搜索参数
    this.searchParams = copyObj(this.listParams)
    this.getList()
  },
  methods: {
    /**
       * @Description: 获取列表数据
       * @date 2019/5/13  13:34
       */
    getList () {
      // 如果没有baseListUrl 则不搜索
      if (!this.baseListUrl) return
      this.tableLoading = true
      commonGetList(this.baseListUrl, this.searchParams).then(res => {
        // 使用 filterData 进行数据格式化。
        this.listData = dataFilterReform(res.rows, this.filterData)
        this.listTotal = res.total
        this.tableLoading = false
      }, () => {
        this.tableLoading = false
      })
    },

    /**
       * @Description: 公用的删除请求函数
       */
    deleteRecord (params) {
      commonDeleteRecord(this.baseListUrl, {id: params.id}).then(() => {
        this.$Message.success('删除成功')
        this.getList()
      })
    },

    /**
       * @Description: 页码改变事件
       * @date 2019/5/10  14:10
       */
    pageChange (page) {
      this.listParams.pageNumber = page
      // 拷贝搜索数据
      this.searchParams = lodash.cloneDeep(this.listParams)
      this.getList()
      this.$router.push({
        query: {
          page: page
        }
      })
    }
  }
}
</script>
