<template>
  <div id="UserTable">
    <el-table :data.sync="users_list" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名" width="280">
        <template slot-scope="scope">
          <div @mouseenter="openInlineOperate(scope)" @mouseleave="closeInlineOperate(scope)">
            <el-row>
              <el-col :span="4">
                <img class="head_image" :src="scope.row.head_image" alt>
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
        <el-form-item prop="username" label="用户名">
          <el-input v-model="editData.username" placeholder="请输入用户名" />
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
    <el-dialog title="提示" :visible.sync="deletePrompt">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletePrompt = false">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </span>
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
export default {
  name: 'UserTable',
  filters: {
    statusFilter
  },
  props: ['currentPage', 'usersList', 'total', 'pageSize'],
  data() {
    return {
      scope: null,
      inline_operate: [], // 表格内联操作是否显示
      editVisible: false, // 快速编辑界面是否显示
      editLoading: false, // 快速编辑界面是否处于加载中
      editDataRules,
      status: [0, 1, 2], // 权限
      editData: { // 快速编辑中的表单
        id: undefined,
        username: '',
        password: '',
        email: '',
        phone: '',
        status: 0,
        $index: 0
      },
      deletePrompt: false, // 内联删除成员提醒界面
      deletePrompt_data: {
        $index: 0,
        id: 0
      }
    }
  },
  created() {
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
      this.$router.push({ path: 'allUser/edit?id=' + scope.row.id + '&' + 'username=' + scope.row.username })
    },
    quickEditUser(scope) {
      this.editData.id = scope.row.id
      this.editData.username = scope.row.username
      this.editData.email = scope.row.email
      this.editData.status = scope.row.status
      this.editData.phone = scope.row.phone
      this.editData.password = scope.row.password
      this.editVisible = true
    },
    openDeletePrompt(scope) {
      this.deletePrompt = true
      this.deletePrompt_data.$index = scope.$index
      this.deletePrompt_data.id = scope.row.id
    },
    async deleteUser() {
      const req = await deleteUser(this.deletePrompt_data.id)
      this.users_list.splice(this.deletePrompt_data.$index, 1)
      this.deletePrompt = false
    },
    async editSubmit() {
      this.$refs['editData'].validate(async(valid) => {
        if (valid) {
          this.editLoading = true
          const req = await editSubmit(this.editData)
          Object.keys(this.editData).forEach(item => {
            if (item !== '$index') {
              this.users_list[this.editData.$index][item] = this.editData[item]
            }
          })
          this.editLoading = false
          this.editVisible = false
        } else {
          return false
        }
      })
    },
    editCancel() {
      this.editVisible = false
    }
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
