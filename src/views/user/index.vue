<template>
  <div id="User">
    <el-table :data.sync="users_list" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名" width="280">
        <template slot-scope="scope">
          <div @mouseenter="openInlineOperate(scope)" @mouseleave="closeInlineOperate(scope)">
            <el-row>
              <el-col :span="4">
                <img class="head_image" :src="baseUrl + '/' + scope.row.head_image" alt>
              </el-col>
              <el-col :span="20">
                {{ scope.row.username }}
                <ul class="operate-inline">
                  <li @click="editUser(scope)">编辑</li>
                  <li @click="quickEditUser(scope)">快速编辑</li>
                  <li @click="openDeletePrompt(scope)">删除</li>
                  <div class="clear" />
                </ul>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="350" />
      <el-table-column label="角色" width="200">
        <template slot-scope="scope">{{ scope.row.status | statusFilter }}</template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="200" />
    </el-table>
    <el-dialog title="快速编辑" :visible.sync="editVisible">
      <el-form ref="editData" v-loading="editLoading" :model="editData" :rules="editDataRules" label-width="80px">
        <el-form-item prop="name" label="用户名">
          <el-input v-model="editData.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item prop="status" label="权限">
          <el-select v-model="editData.status" placeholder="请选择">
            <el-option
              v-for="item in status"
              :key="item"
              :label="item | statusFilter"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="editData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item>
          <el-row :gutter="4">
            <el-col :span="12">
              <el-button type="primary" style="width: 100%" @click="editSubmit">提交</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" style="width: 100%" @click="editCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-pagination
      :page-size="page_size.num"
      :pager-count="11"
      layout="prev, pager, next"
      :current-page="current_page.num"
      :total="total.num"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import { getUserList, editSubmit, deleteUser } from '@/api/user'
import editDataRules from '@/views/user/rules/index'
import { statusFilter } from '@/views/user/filter/index'
import service from '@/utils/request'
export default {
  name: 'User',
  filters: {
    statusFilter
  },
  data() {
    return {
      current_page: { num: 1 }, // 当前页数
      total: { num: 0 }, // 总用户条数
      page_size: { num: 9 }, // 每页显示的用户条数
      users_list: [],
      scope: null,
      inline_operate: [], // 表格内联操作是否显示
      editVisible: false, // 快速编辑界面是否显示
      editLoading: false, // 快速编辑界面是否处于加载中
      editDataRules,
      status: [0, 1, 2], // 权限
      editData: { // 快速编辑中的表单
        id: undefined,
        name: '',
        password: '',
        email: '',
        phone: '',
        status: 0,
        $index: 0
      },
      baseUrl: service.defaults.baseURL
    }
  },
  // 进入编辑后会触发一次，点击返回还会执行一次
  // 先触发beforeRouteUpdate后执行，created
  created() {
    this.displayUserList(this.$route.query.page, this.page_size.num)
    for (let i = 0; i < this.page_size; i++) {
      this.inline_operate[i] = false
    }
  },
  methods: {
    openInlineOperate(scope) {
      document.getElementsByClassName('operate-inline')[scope.$index].style.display = 'block'
    },
    closeInlineOperate(scope) {
      document.getElementsByClassName('operate-inline')[scope.$index].style.display = 'none'
    },
    pageChange(page) {
      this.$router.replace('?page=' + page)
    },
    editUser(scope) {
      this.scope = scope
      this.$router.push({ name: 'editUser', params: { ...scope.row }})
    },
    quickEditUser(scope) {
      this.editData.id = scope.row.id
      this.editData.name = scope.row.username
      this.editData.email = scope.row.email
      this.editData.status = scope.row.status
      this.editData.phone = scope.row.phone
      this.editData.password = scope.row.password
      this.editVisible = true
    },
    async openDeletePrompt(scope) {
      try {
        await this.$confirm('您确定删除该成员吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.deleteUser(scope.row.id, scope.$index)
      } catch {}
    },
    async deleteUser(id, index) {
      const req = await deleteUser(id)
      if (req.code === 0) {
        this.users_list.splice(index, 1)
        this.$message.success(req.msg)
      } else {
        this.$message.error(req.msg)
      }
      this.deletePrompt = false
    },
    async editSubmit() {
      this.$refs['editData'].validate(async(valid) => {
        if (valid) {
          this.editLoading = true
          const req = await editSubmit(this.editData)
          if (req.code === 0) {
            Object.keys(this.editData).forEach(item => {
              if (item !== '$index') {
                this.users_list[this.editData.$index][item] = this.editData[item]
              }
            })
            this.$message.success(req.msg)
            this.editVisible = false
          } else {
            this.$message.error(req.msg)
          }
          this.editLoading = false
        } else {
          return false
        }
      })
    },
    editCancel() {
      this.editVisible = false
    },
    displayUserList(page, pageSize, status) {
      getUserList(page, pageSize, 3).then(data => {
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
