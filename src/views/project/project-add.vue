<template>
  <div id="ProjectAdd">
    <el-form ref="projectForm" :model="projectForm" class="ProjectAdd" :rules="projectRule">
      <el-form-item label="项目描述" prop="description">
        <el-input v-model="projectForm.description" type="textarea" />
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-date-picker
          v-model="projectForm.time"
          type="date"
          placeholder="选择日期"
          format="yyyy/MM/dd"
          value-format="yyyy/MM/dd"
        />
      </el-form-item>
      <el-form-item prop="image" label="项目图片">
        <el-upload
          class="avatar-uploader"
          action="123"
          :http-request="upLoad"
          :show-file-list="false"
          :before-upload="beforeImageUpload"
        >
          <img v-if="imageUrl" :src="baseUrl + '/' + imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="submitLoading" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addProject,uploadProjectImage } from '@/api/project'
import projectRule from '@/views/project/rules/index'
import service from '@/utils/request'
export default {
  name: 'ProjectAdd',
  data() {
    return {
      projectForm: {
        id: '',
        description: '',
        time: '',
        rawImageURL: undefined,
        compressImageURL: undefined
      },
      imageUrl: '',
      submitLoading: false,
      projectRule,
      baseUrl: service.defaults.baseURL
    }
  },
  methods: {
    async upLoad(file) {
      let formData = new FormData();
      formData.append('projectImage', file.file);
      let req = await uploadProjectImage(formData);
      if (Number(req.code) === 0) {
          this.projectForm.compressImageURL = req.data.image_compress;
          this.projectForm.rawImageURL = req.data.image_raw;
          this.imageUrl = req.data.image_compress;
          this.$message({
            type: "success",
            message: "上传成功"
          });
        } else {
          this.$message({
            type: "error",
            message: "上传失败"
          });
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
        this.$message.error('上传图片大小不能超过 2MB!')
      }

      return isLt2M && (isJPG || isPNG || isJPEG)
    },
    async submit() {
      this.$refs['projectForm'].validate(async(valid) => {
        if (valid) {
          this.submitLoading = true
          const req = await addProject(this.projectForm)
          if (req.code === 0) {
            this.$message.success(req.msg)
          } else {
            this.$message.error(req.msg)
          }
          this.submitLoading = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scope>
.ProjectAdd {
  width: 480px;
  margin-left: 32px;
}
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
  width: 260px;
  height: 180px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 260px;
  height: 180px;
  display: block;
}
</style>
