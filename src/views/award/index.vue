
<template>
  <div id="Award">
    <el-table :data.sync="awards_list" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="奖项名字" width="320" prop="name" />
      <el-table-column label="时间" width="150" prop="time" />
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-row :gutter="4"> 
            <el-col :span="12">
                <el-button type="primary" @click="quickEditProject(scope)">快速编辑</el-button>
            </el-col>
            <el-col :span="12">
                <el-button type="primary" @click="openDeletePrompt(scope)">删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="快速编辑" :visible.sync="editVisible">
      <el-form ref="editData" :model="editData" v-loading="editLoading" label-width="80px">
        <el-form-item label="项目名字" prop="name">
            <el-input v-model="editData.name" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item prop="time" label="时间">
          <el-date-picker
            v-model="editData.time"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="4">
            <el-col :span="12">
              <el-button type="primary" @click="modifyAward" style="width: 100%">提交</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="editCancel" style="width: 100%">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="deletePrompt">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletePrompt = false">取 消</el-button>
        <el-button type="primary" @click="delAward">确 定</el-button>
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
import { getAllAwards, delAward, modifyAward } from '@/api/award'
export default {
  name: 'Award',
  data() {
    return {
      page_size: 9,
      total: 0,
      current_page: 1,
      awards_list: [],
      editData: {
          name: '',
          time: '',
          id: undefined,
          $index: undefined
      },
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
    this.displayAwardList(this.$route.query.page, this.page_size)
  },
  methods: {
    displayAwardList(page, pageSize) {
      getAllAwards(page, pageSize).then(data => {
        data.data.awards_list.forEach((item, key) => {
          item.$index = key
          this.awards_list.push(item)
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
    async delAward() {
      const req = await delAward(this.deletePrompt_data.id)
      this.awards_list.splice(this.deletePrompt_data.$index, 1)
      this.deletePrompt = false
    },
    quickEditProject(scope) {
      this.editData.$index = scope.$index
      this.editData.id = scope.row.id
      this.editData.time = scope.row.time
      this.editData.name = scope.row.name
      this.editVisible = true
    },
    modifyAward() {
        this.$refs['editData'].validate(async(valid) => {
        if (valid) {
          this.editLoading = true
          const req = await modifyAward(this.editData)
          Object.keys(this.editData).forEach(item => {
            if (item !== '$index') {
              this.awards_list[this.editData.$index][item] = this.editData[item]
            }
          })
          if (req.code === 0) {
            this.$message.success(req.msg)
          } else {
            this.$message.error(req.msg)
          }
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
      this.awards_list = []
      this.displayAwardList(to.query.page, this.page_size)
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
