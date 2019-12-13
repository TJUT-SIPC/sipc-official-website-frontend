<template>
  <div id="Profile">
    <h1>{{ title }}</h1>
    <el-form
      ref="profile"
      :model="profile"
      label-position="left"
      label-width="180px"
      class="profile"
      :rules="editDataRules"
    >
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="123"
          :http-request="upLoad"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-error="handleAvatarError"
          :on-progress="handleAvatarError"
        >
          <img v-if="profile.imageUrl" :src="profile.imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="profile.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="profile.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="profile.age" placeholder="请输入年龄"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="profile.gender" placeholder="请选择">
          <el-option
            v-for="item in profile_gender_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学号" prop="student_id">
        <el-input v-model="profile.student_id" placeholder="请输入学号"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="profile.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="profile.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="用户权限" prop="status">
        <el-select v-model="profile.status" placeholder="请选择">
          <el-option
            v-for="item in profile_status"
            :key="item"
            :label="item | statusFilter"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户备注">
        <el-input type="textarea" v-model="profile.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="modifyUser" type="primary">更改个人信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/*
  个人信息界面需要一个获取个人信息的api
*/
import { uploadHeadImage, editSubmit } from '@/api/user'
import { statusFilter } from './filter/index'
import editDataRules from './rules/index'
export default {
  name: 'Profile',
  filters: {
    statusFilter
  },
  data() {
    return {
      title: '',
      profile: {
        id: undefined,
        username: '',
        password: '',
        age: '',
        gender: '',
        email: '',
        student_id: '',
        phone: '',
        status: undefined,
        remark: '',
        imageUrl: ''
      },
      profile_gender_options: [
        { value: '男', label: '男' },
        { value: '女', label: '女' }
      ],
      profile_status: [0, 1, 2],
      editDataRules
    }
  },
  props: ['scope'],
  created() {
    // 由于是先变url后执行created所以可以根据this.$route.query.id来判断是该组件是修改自己的信息，还是在userTable中复用该组件修改信息
    if (this.$route.query.id && this.$route.query.username !== this.$store.getters.name) {
      this.title = `${this.$route.query.username}的信息`
    } else {
      this.title = '个人信息'
    }
  },
  methods: {
    async upLoad(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      try {
        const req = await uploadHeadImage(file)
        if (Number(req.code) === 0) {
          this.profile.imageUrl = req.data.image_raw
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
    beforeAvatarUpload(file) {
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
    handleAvatarError(err) {
      console.log(err)
    },
    modifyUser() {
      this.$refs['profile'].validate(async(valid) => {
        if (valid) {
          this.modifyLoading = true
          const req = await editSubmit(this.profile)
          this.modifyLoading = false
          this.$message.success(req.msg)
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
#profile {
  padding-bottom: 128px;
}
.profile {
  width: 620px;
  margin-top: 48px;
  margin-left: 16px;
}
.avatar-uploader {
  width: 180px;
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
  width: 178px;
  height: 178px;
  display: block;
}
</style>
