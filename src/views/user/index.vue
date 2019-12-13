<template>
  <div id="User">
    <router-view 
    :current_page="current_page"
    :users_list="users_list"
    :total="total"
    :page_size="page_size">
    </router-view>
  </div>
</template>

<script>
import { getUserList } from '@/api/user'
export default {
  name: 'User',
  data() {
    return {
      current_page: { num: 1 }, // 当前页数
      total: { num: 0 }, // 总用户条数
      page_size: { num: 9 }, // 每页显示的用户条数
      users_list: [],
    }
  },
  // 进入编辑后会触发一次，点击返回还会执行一次
  // 先触发beforeRouteUpdate后执行，created
  created() { 
    this.displayUserList(this.$route.query.page, this.page_size.num)
  },
  methods: {
    displayUserList(page, pageSize, status) {
      getUserList(page, pageSize, status).then(data => {
        data.data.users_list.forEach((item, key) => {
          item.$index = key
          this.users_list.push(item)
        })
        this.total.num = Number(data.data.total)
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!to.query.page) {
      next(to.path + '?page=1')
    } next()
  },
  beforeRouteUpdate(to, from, next) {
    // 只有点击页面底部el-pagination时才会触发
    if (to.query.page) {
      this.users_list = []
      this.displayUserList(to.query.page, this.page_size.num, 0)
      if (to.query.page) {
        this.current_page.num = Number(to.query.page)
      } else {
          this.current_page.num = 1
      }
    }
    next()
  }
}
</script>
