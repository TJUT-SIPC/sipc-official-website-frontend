<template>
  <div id="Project">
    <el-table :data.sync="projects_list" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="项目描述" width="300">
        <template slot-scope="scope">
          <!-- <div
            class="inline"
            @mouseenter="openInlineOperate(scope)"
            @mouseleave="closeInlineOperate(scope)"
          > -->
            {{ introduce(scope.row.description) }}
            <!-- <ul class="operate-inline">
              <li @click="quickEditProject(scope)">快速编辑</li>
              <li @click="openDeletePrompt(scope)">删除</li>
              <div class="clear" />
            </ul> -->
          <!-- </div> -->
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="time" />
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-row :gutter="1">
            <el-col :span="12">
              <el-button type="primary" @click="quickEditProject(scope)">快速编辑</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="danger" @click="openDeletePrompt(scope)">删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="快速编辑" :visible.sync="editVisible">
      <el-form ref="editData" v-loading="editLoading" :model="editData" :rules="projectRule" label-width="80px">
        <el-form-item prop="description" label="项目描述">
          <el-input v-model="editData.description" type="textarea" placeholder="项目描述" />
        </el-form-item>
        <el-form-item prop="time" label="时间">
          <el-date-picker
            v-model="editData.time"
            type="date"
            placeholder="选择日期"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
          />
        </el-form-item>
        <el-form-item label="项目图片" prop="image">
          <el-upload
            class="avatar-uploader"
            action="123"
            :http-request="upLoad"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
          >
            <img v-if="editData.compressImageURL" :src="baseUrl + '/' + editData.compressImageURL" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="4">
            <el-col :span="12">
              <el-button type="primary" style="width: 100%" @click="modifyProject">提交</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" style="width: 100%" @click="editCancel">取消</el-button>
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
      :total="total"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import projectRule from '@/views/project/rules/index'
import { modifyProject, delProject, uploadProjectImage, getProjects } from '@/api/project'
import service from '@/utils/request'
export default {
  name: 'Project',
  data() {
    return {
      current_page: 1, // 当前页数
      total: 0, // 总用户条数
      page_size: 9, // 每页显示的用户条数
      projects_list: [],
      scope: null,
      inline_operate: [], // 表格内联操作是否显示
      editVisible: false, // 快速编辑界面是否显示
      editLoading: false, // 快速编辑界面是否处于加载中
      editData: { // 快速编辑中的表单
        id: undefined,
        description: '',
        time: '',
        compressImageURL: '',
        rawImageURL: '',
        $index: 0
      },
      projectRule,
      baseUrl: service.defaults.baseURL
    }
  },
  // 进入编辑后会触发一次，点击返回还会执行一次
  // 先触发beforeRouteUpdate后执行，created
  created() {
    for (let i = 0; i < this.page_size; i++) {
      this.inline_operate[i] = false
    }
    this.displayProjectList(this.$route.query.page, this.page_size)
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
      formData.append('projectImage', file.file)
      try {
        const req = await uploadProjectImage(formData)
        if (Number(req.code) === 0) {
          this.editData.compressImageURL = req.data.image_compress
          this.editData.rawImageURL = req.data.image_raw
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
      this.editData.compressImageURL = scope.row.img.compress.replace(/\w+:\/\/\d+\.\d+\.\d+\.\d+:\d+\//, '')
      this.editData.rawImageURL = scope.row.img.raw.replace(/\w+:\/\/\d+\.\d+\.\d+\.\d+:\d+\//, '')
      this.editVisible = true
    },
    openDeletePrompt(scope) {
      this.delProject(scope.row.id, scope.$index)
    },
    async delProject(id, index) {
      try {
        await this.$confirm('您确定要删除该项目', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        })
        const req = await delProject(id)
        if (req.code === 0) {
          this.$message.success(req.msg)
        } else {
          this.$message.error(req.msg)
        }
        this.projects_list.splice(index, 1)
      } catch {}
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
    },
    displayProjectList(page, pageSize, status) {
      getProjects(page, pageSize).then(data => {
        data.data.projects_list.forEach((item, key) => {
          item.$index = key
          this.projects_list.push(item)
        })
        this.total = Number(data.data.total)
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