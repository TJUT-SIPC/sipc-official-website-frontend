<template>
  <div id="Wish">
    <el-table :data.sync="wishes_list" width="100%">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="作者" prop="name" width="84"/>
      <el-table-column label="寄语" prop="word" width="400" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-select v-model="scope.row.status" @change="changeStatus(scope)" placeholder="请选择">
            <el-option
            v-for="item in status"
            :key="item"
            :label="item | statusFilter"
            :value="item">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
    :page-size="page_size"
    :pager-count="11"
    layout="prev, pager, next"
    :current-page="current_page"
    @current-change="pageChange"
    :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getAllWishes, modifyWish, delWish } from '@/api/wish'
import { statusFilter } from '@/views/wish/filter/index'
export default {
  name: 'Wish',
  filters: {
    statusFilter
  },
  data() {
    return {
      page_size: 9,
      total: 0,
      current_page: 1,
      status: ['0', '1', '2', '3'],
      form_list: [],
      wishes_list: []
    }
  },
  created() {
    this.displayWishList(this.$route.query.page, this.page_size, 3)
  },
  methods: {
    async displayWishList(page, pageSize, status) {
      this.form_list = []
      const data = await getAllWishes(page, pageSize, status)
      data.data.wishes_list.forEach((item, key) => {
          item.$index = key
          this.wishes_list.push(item)
          this.form_list.push(item)
        })
      this.total = Number(data.data.total)
    },
    pageChange(page) {
      this.$router.replace('?page=' + page)
    },
    async changeStatus(scope) {
      const req = await modifyWish(scope.row.id, scope.row.status)
      if (req.code === 0) {
        this.$message.success(req.msg)
      } else {
        this.$message.error(req.msg)
      }
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
      this.wishes_list = []
      this.displayProjectList(to.query.page, this.page_size, 0)
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

<style scope>
.el-pagination {
  padding-bottom: 120px;
  margin-top: 32px;
  margin-left: 48px;
}
</style>