<template>
  <div id="UserTable">
    <el-table :data="users_list" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名" width="280">
        <template slot-scope="scope">
          <div @mouseenter="openInlineOperate(scope)" @mouseleave="closeInlineOperate(scope)">
            <el-row>
              <el-col :span="4">
                <img class="head_image" :src="scope.row.head_image" alt />
              </el-col>
              <el-col :span="20">
								{{ scope.row.name }}
                <ul class="operate-inline">
                  <li @click="editUser(scope)">快速编辑</li>
                  <li>删除</li>
                  <div class="clear"></div>
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
    <el-dialog title="快速编辑" :visible.sync="dialogVisible">
      <el-form ref="editDialogData" :model="editDialogData" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editDialogData.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editDialogData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-select v-model="editDialogData.status" placeholder="请选择">
            <el-option
              v-for="item in status"
              :key="item"
              :label="item | statusFilter"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editDialogData.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="4">
            <el-col :span="12">
              <el-button type="primary" @click="dialogSubmit" style="width: 100%">提交</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="dialogCancel" style="width: 100%">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
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
import { getUserList } from '@/api/user'
export default {
  name: 'UserTable',
  filters: {
    statusFilter(data) {
      if (data === 0) {
        return '普通用户'
      } else if (data === 1) {
        return '管理员'
      } else if (data === 2) {
        return '超级管理员'
      }
    }
  },
  data() {
    return {
      page_size: 9, // 每页显示的用户条数
      current_page: 1, // 当前页数
      total: 0, // 总用户条数
      inline_operate: [], // 表格内联操作是否显示
      dialogVisible: false,
      status: [0, 1, 2],
      editDialogData: {
        name: '',
        email: '',
        status: 0
      },
      users_list: []
    }
  },
  created() {
    this.current_page = this.$route.query.page?Number(this.$route.query.page):1
    // 没有匹配到相当于第一页
    if(!this.$route.query.page || Number(this.$route.query.page) === 1) {
      this.displayUserList(1, this.page_size)
    } else {
      this.displayUserList(this.$route.query.page, this.page_size)
    }
    for (let i = 0; i < this.page_size; i++) {
      this.inline_operate[i] = false
    }
  },
  methods: {
    displayUserList(page, pageSize) {
      getUserList(page, pageSize).then(data => {
        data.data.users_list.forEach((item, key) => {
          item.$index = key
          this.users_list.push(item)
        })
				this.total = Number(data.data.total)
      })
    },
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
      this.editDialogData.name = scope.row.name
      this.editDialogData.email = scope.row.email
      this.editDialogData.status = scope.row.status
      this.editDialogData.phone = scope.row.phone
      this.dialogVisible = true
    },
    dialogSubmit() {
      
    },
    dialogCancel() {
      this.dialogVisible = false
    }
	},
	beforeRouteUpdate(to, from, next) {
    this.users_list = []
    this.displayUserList(to.query.page, this.page_size)
    this.current_page = to.query.page?Number(to.query.page):1
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
    .operate-inline li{
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
