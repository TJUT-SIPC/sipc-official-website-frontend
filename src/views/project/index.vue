<template>
  <div id="Project">
    <router-view 
    :current_page="current_page"
    :projects_list="projects_list"
    :total="total"
    :page_size="page_size">
    </router-view>
  </div>
</template>

<script>
import { getProjects } from '@/api/project'
export default {
  name: 'Project',
  data() {
    return {
      current_page: { num: 1 }, // 当前页数
      total: { num: 0 }, // 总用户条数
      page_size: { num: 9 }, // 每页显示的用户条数
      projects_list: [],
    }
  },
  // 进入编辑后会触发一次，点击返回还会执行一次
  // 先触发beforeRouteUpdate后执行，created
  created() { 
    this.displayProjectList(this.$route.query.page, this.page_size.num)
  },
  methods: {
    displayProjectList(page, pageSize, status) {
      getProjects(page, pageSize).then(data => {
        data.data.projects_list.forEach((item, key) => {
          item.$index = key
          this.projects_list.push(item)
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
      this.projects_list = []
      this.displayProjectList(to.query.page, this.page_size.num, 0)
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
