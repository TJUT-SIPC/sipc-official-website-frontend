
<template>
  <div id="Message">
    <el-table :data.sync="messages_list" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="姓名" width="100" prop="nickname" />
      <el-table-column label="邮箱" width="180" prop="email" />
      <el-table-column label="时间" width="100" prop="upload_time" />
      <el-table-column label="建议" width="600" prop="advice" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" @click="openDeletePrompt(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="deletePrompt">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletePrompt = false">取 消</el-button>
        <el-button type="primary" @click="delMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      :page-size="page_size"
      :pager-count="11"
      layout="prev, pager, next"
      :current-page="current_page"
      @current-change="pageChange"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { getMessage, delMessage } from '@/api/message'
export default {
  name: 'Message',
  data() {
    return {
      page_size: 9,
      total: 0,
      current_page: 1,
      messages_list: [],
      editVisible: false, // 快速编辑界面是否显示
      editLoading: false, // 快速编辑界面是否处于加载中
      deletePrompt: false, // 内联删除成员提醒界面
      deletePrompt_data: {
        $index: 0,
        id: 0
      }
    }
  },
  created() {
    this.displayMessageList(this.$route.query.page, this.page_size)
  },
  methods: {
    displayMessageList(page, pageSize, status) {
      getMessage(page, pageSize, status).then(data => {
        data.data.messages_list.forEach((item, key) => {
          item.$index = key
          this.messages_list.push(item)
        })
        this.total = Number(data.data.total)
      })
    },
    pageChange(page) {
      this.$router.replace('?page=' + page)
    },
    openDeletePrompt(scope) {
      this.deletePrompt = true
      this.deletePrompt_data.$index = scope.$index
      this.deletePrompt_data.id = scope.row.id
    },
    async delMessage() {
      const req = await delMessage(this.deletePrompt_data.id)
      this.messages_list.splice(this.deletePrompt_data.$index, 1)
      this.deletePrompt = false
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!to.query.page) {
      next(to.path + '?page=1')
    }
    next()
  },
  beforeRouteUpdate(to, from, next) {
    // 只有点击页面底部el-pagination时才会触发
    if (to.query.page) {
      this.messages_list = []
      this.displayMessageList(to.query.page, this.page_size)
      if (to.query.page) {
        this.current_page = Number(to.query.page)
      } else {
        this.current_page = 1
      }
    }
    next()
  }
}
</script>

<style scoped>
.operate-inline {
  margin: 0;
  padding: 0;
  display: none;
}
.operate-inline li {
  height: 14px;
  line-height: 14px;
  list-style: none;
  float: left;
  font-size: 14px;
  margin-left: 6px;
  cursor: grab;
}
.head_image {
  height: 32px;
  width: 32px;
}
.el-pagination {
  padding-bottom: 120px;
  margin-top: 32px;
  margin-left: 48px;
}
.clear {
  clear: both;
}
</style>
