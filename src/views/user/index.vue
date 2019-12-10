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
                  <li>编辑</li>
                  <li>查看</li>
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
      <el-table-column prop="name" label="用户名" width="200" />
    </el-table>
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
      dataCount: 9,
      inline_operate: [],
      users_list: [],
      back_list: [],
      next_list: []
    }
  },
  created() {
    this.displayUserList()
    for (let i = 0; i < this.dataCount; i++) {
      this.inline_operate[i] = false
    }
  },
  methods: {
    increase(index) {
      return ++index
    },
    displayUserList() {
      getUserList().then(data => {
        data.data.users_list.forEach((item, key) => {
          item.$index = key
          this.users_list.push(item)
        })
      })
    },
    openInlineOperate(scope) {
      document.getElementsByClassName('operate-inline')[scope.$index].style.display = 'block'
    },
    closeInlineOperate(scope) {
      document.getElementsByClassName('operate-inline')[scope.$index].style.display = 'none'
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
        list-style: none;
        float: left;
        font-size: 14px;
        margin-left: 6px;
    }
    .head_image {
        height: 32px;
        width: 32px;
    }
    .clear {
        clear: both;
    }
</style>
