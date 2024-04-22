<template>
  <a-layout class="table">
    <a-layout-header class="ant-layout-header--small">
      <Header />
    </a-layout-header>
    <a-layout>
      <a-layout-header class="search-container">
        <a-layout>
          <a-layout-sider width="260">
            <span class="title">规则列表</span>
          </a-layout-sider>
          <a-layout-content>
            <Search :data="params"
                    style="margin-left: 10px;"
                    @search="searchTable" />
          </a-layout-content>
        </a-layout>
      </a-layout-header>
      <a-layout>
        <a-layout-sider width="300px"
                        style="padding-left: 40px;">
          <div class="tree-wrapper">
            <Tree ref="groupTree"
                  @selectedTree="selectedTree" />
          </div>
        </a-layout-sider>
        <a-layout-content class="container"
                          style="padding-right: 40px;">
          <div ref="listContainer"
               class="list-container">
            <a-spin :spinning="loading">
              <div class="clearfix">
                <TableListAdd :width="listWidth"
                              @add="createRules" />
                <TableList v-for="(item,index) in tableData"
                           :data="item"
                           :key="index"
                           :width="listWidth"
                           @copy="copy(item)"
                           @edit="edit(item)"
                           @delete="deleteItem(item)" />
              </div>
              <a-pagination class="pagination"
                            v-model="current"
                            :pageSize="params.pageSize"
                            :total="total"
                            @change="changePage"
                            show-less-items />
            </a-spin>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import Header from './components/Header.vue'
import TableList from './components/TableList.vue'
import TableListAdd from './components/TableListAdd.vue'
import RulesSet from './components/RulesSet.vue'
import Tree from './components/Tree.vue'
import Search from './components/Search.vue'
import { formatDate } from '../../../utils/date'
import Cookies from 'js-cookie'
import {
  getEngineListData,
  deleteEngineData,
  copyEngineData
} from '../../api/table'
import { awaitWrap } from '../../../utils/sugars'

export default {
  name: 'Table',
  components: {
    Header,
    TableList,
    TableListAdd,
    Tree,
    Search
  },
  watch: {
    listNum (value) {
      this.listWidth = (this.realWidth - value * 10) / value
      this.params.pageSize = value * 3 - 1
      this.getTableData()
    }
  },
  data () {
    return {
      loading: false,
      total: 1,
      current: 1,
      listWidth: 298, // list块的宽度  根据屏幕大小计算出不同的宽度
      listNum: 0, // 一行展示list的数量 默认是5个 小屏幕展示4个
      realWidth: 0, // 列表区域实际宽度
      FORMAT: 'MM-DD HH:mm',
      params: {
        pageNum: 1,
        pageSize: 15
      },
      tableData: []
    }
  },
  mounted () {
    if (Cookies.get('token') == null) {
      this.$router.push({
        path: this.$route.query.redirect || '/login'
      })
    }
    // 初始化缓存
    this.initByCache()
    this.calcListWidth()
  },
  methods: {
    // 搜索数据
    searchTable (obj) {
      this.params = Object.assign(this.params, obj)
      this.current = 1
      this.params.pageNum = 1
      // 每次查询时保存参数
      this.saveCache()
      this.getTableData()
    },
    // 分页改变
    changePage (page, pageSize) {
      this.params.pageNum = page
      // 每次查询时保存参数
      this.saveCache()
      this.getTableData()
    },
    // 选中树
    selectedTree (keys) {
      keys = keys.length ? keys : ['']
      this.params.groupId = keys[0].toString()
      this.current = 1
      this.params.pageNum = 1
      // 每次查询时保存参数
      this.saveCache()
      this.getTableData()
    },
    // 创建规则
    createRules () {
      let groupId = this.$refs.groupTree.getCurrentNodeKey()
      this.dialog({
        title: '请设置基础数据',
        body: <RulesSet ref="RulesSet" group-id={groupId} />,
        theme: 'dark',
        beforeClose: async (type, close) => {
          if (type === 'confirm') {
            const result = await this.$refs.RulesSet.submit()
            if (result) {
              this.$router.push({
                path: '/rule-designer',
                query: result
              })
              close()
            }
          } else {
            close()
          }
        }
      }).then(() => {
        this.$nextTick(() => {
          this.$refs.RulesSet.focus()
        })
      })
    },
    // 编辑
    edit (item) {
      this.$router.push({
        path: '/rule-designer',
        query: { id: item.id }
      })
    },
    // 删除
    deleteItem (item) {
      const that = this
      this.confirm({
        title: '请确认是否删除数据',
        async onOk () {
          const [err, data] = await awaitWrap(deleteEngineData(item.id))
          if (!err) {
            that.getTableData()
          }
        }
      })
    },
    // 拷贝
    copy (item) {
      const that = this
      this.confirm({
        title: '请确认是否拷贝数据',
        async onOk () {
          const [err, data] = await awaitWrap(copyEngineData(item.id))
          if (!err) {
            that.getTableData()
          }
        }
      })
    },
    // 获取规则引擎列表数据
    async getTableData () {
      this.showLoading()
      const [err, data] = await awaitWrap(getEngineListData(this.params))
      this.hideLoading()
      if (!err) {
        const listData = data.data
        // 时间格式化
        listData.forEach((item) => {
          item.create_time = formatDate(item.create_time, this.FORMAT)
          item.update_time = formatDate(item.update_time, this.FORMAT)
        })
        this.tableData = listData
        this.total = data.count
      } else {
        this.message.error('查询错误: ' + err.message)
      }
    },
    // 计算列表区域可用宽度
    calcListWidth () {
      setTimeout(() => {
        const elem = this.$refs.listContainer
        this.realWidth = Math.floor(elem.getBoundingClientRect().width) - 6
        if (this.realWidth < 1300) {
          this.listNum = 4
        } else {
          this.listNum = 5
        }
      }, 20)
    },
    showLoading () {
      this.loading = true
    },
    hideLoading () {
      this.loading = false
    },
    initByCache () {
      let params = window.sessionStorage.getItem('params')
      if (params) {
        try {
          params = JSON.parse(params)
        } catch (error) {
          params = this.params
        }
      } else {
        params = this.params
      }
      // 分配参数
      this.params = params
      this.current = this.params.pageNum || 1
      const { groupTree } = this.$refs
      groupTree && groupTree.setCurrentNodeKey(+this.params.groupId || '')
    },
    saveCache () {
      // 将当前节点，搜索条件，分页参数作为缓存保存起来
      let storage = window.sessionStorage
      storage.setItem('params', JSON.stringify(this.params))
    }
  }
}
</script>

<style scoped>
</style>