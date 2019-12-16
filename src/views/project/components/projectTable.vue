<template>
  <div id="UserTable">
    <el-table :data.sync="projects_list" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="项目描述" width="300">
        <template slot-scope="scope">
          <div
            class="inline"
            @mouseenter="openInlineOperate(scope)"
            @mouseleave="closeInlineOperate(scope)"
          >
            {{ introduce(scope.row.description) }}
            <ul class="operate-inline">
              <li @click="quickEditProject(scope)">快速编辑</li>
              <li @click="openDeletePrompt(scope)">删除</li>
              <div class="clear"></div>
            </ul>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="time" />
    </el-table>
    <el-dialog title="快速编辑" :visible.sync="editVisible">
      <el-form ref="editData" :model="editData" v-loading="editLoading" label-width="80px">
        <el-form-item prop="description" label="项目描述">
          <el-input type="textarea" v-model="editData.description" placeholder="请输入用户名"></el-input>
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
        <el-form-item label="项目图片">
            <el-upload
              class="avatar-uploader"
              action="123"
              :http-request="upLoad"
              :show-file-list="false"
              :before-upload="beforeImageUpload">
              <img v-if="editData.image.compress" :src="editData.image.compress" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="4">
            <el-col :span="12">
              <el-button type="primary" @click="modifyProject" style="width: 100%">提交</el-button>
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
        <el-button type="primary" @click="delProject">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      :page-size="page_size.num"
      :pager-count="11"
      layout="prev, pager, next"
      :current-page="current_page.num"
      @current-change="pageChange"
      :total="total.num"
    ></el-pagination>
  </div>
</template>
<script>
import { getProjects, modifyProject, delProject, uploadProjectImage } from '@/api/project'
export default {
  name: 'UserTable',
  filters: {
    date(date) {
      return date.toString()
    }
  },
  data() {
    return {
      scope: null,
      inline_operate: [], // 表格内联操作是否显示
      editVisible: false, // 快速编辑界面是否显示
      editLoading: false, // 快速编辑界面是否处于加载中
      editData: { // 快速编辑中的表单
        id: undefined,
        description: '',
        time: '',
        image: {
          compress: '',
          raw: ''
        },
        $index: 0
      },
      deletePrompt: false, // 内联删除成员提醒界面
      deletePrompt_data: {
        $index: 0,
        id: 0
      }
    }
  },
  props: ['current_page', 'projects_list', 'total', 'page_size'],
  created() {
    for (let i = 0; i < this.page_size; i++) {
      this.inline_operate[i] = false
    }
  },
  methods: {
    introduce(data) {
      if (data.length > 16) {
        return (data.slice(0, 16) + '...')
      } else {
        return data
      }
    },
    async upLoad(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      try {
        const req = await uploadProjectImage(formData)
        if (Number(req.code) === 0) {
          this.editData.image.compress = req.data.image_compress
          this.editData.image.row = req.data.image_row
          this.$message({
            type: 'success',
            message: '上传成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '上传失败'
          })
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: '上传失败'
        })
      }
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!(isJPG || isPNG || isJPEG)) {
        this.$message.error('上传头像图片格式应该为jpeg，png或jpg')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return isLt2M && (isJPG || isPNG || isJPEG)
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
    quickEditProject(scope) {
      this.editData.$index = scope.$index
      this.editData.id = scope.row.id
      this.editData.description = scope.row.description
      this.editData.time = scope.row.time
      this.editData.image = {...scope.row.image}
      this.editVisible = true
    },
    openDeletePrompt(scope) {
      this.deletePrompt = true
      this.deletePrompt_data.$index = scope.$index
      this.deletePrompt_data.id = scope.row.id
    },
    async delProject() {
      const req = await delProject(this.deletePrompt_data.id)
      if (req.code === 0) {
        this.$message.success(req.msg)
      } else {
        this.$message.error(req.msg)
      }
      this.projects_list.splice(this.deletePrompt_data.$index, 1)
      this.deletePrompt = false
    },
    async modifyProject() {
      this.$refs['editData'].validate(async(valid) => {
        if (valid) {
          this.editLoading = true
          const req = await modifyProject(this.editData)
          Object.keys(this.editData).forEach(item => {
            if (item !== '$index') {
              this.projects_list[this.editData.$index][item] = this.editData[item]
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
  }
}
</script>

<style scoped>
.avatar-uploader {
  width: 260px;
  height: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 260px;
  height: 180px;
  display: block;
}
.inline {
  height: 36px;
}
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
.el-pagination {
  padding-bottom: 120px;
  margin-top: 32px;
  margin-left: 48px;
}
.clear {
  clear: both;
}
</style>

