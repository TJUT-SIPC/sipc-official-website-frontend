<template>
  <div id="Profile">
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
          <img v-show="profile.head_image" :src="baseUrl + '/' +profile.head_image" class="avatar">
          <i v-show="!profile.head_image" class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="profile.name" :disabled="(this.$store.state.user.status != 2)" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="profile.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="profile.age" placeholder="请输入年龄" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="profile.gender" placeholder="请选择">
          <el-option
            v-for="item in profile_gender_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学号" prop="student_id">
        <el-input v-model="profile.student_id" placeholder="请输入学号" />
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="profile.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="profile.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="用户权限" prop="status">
        <el-select v-model="profile.status" :disabled="(this.$store.state.user.status != 2)" placeholder="请选择">
          <el-option
            v-for="item in profile_status"
            :key="item"
            :label="item | statusFilter"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户备注">
        <el-input v-model="profile.remark" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitUser">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { uploadHeadImage, editSubmit, getInfo, addUser } from '@/api/user'
import { statusFilter } from './filter/index'
import editDataRules from './rules/index'
import { getId } from '@/utils/auth'
import service from '@/utils/request'
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
        name: '',
        password: '',
        age: '',
        gender: '',
        email: '',
        student_id: '',
        phone: '',
        status: undefined,
        remark: '',
        head_image: ''
      },
      profile_gender_options: [
        { value: '男', label: '男' },
        { value: '女', label: '女' }
      ],
      profile_status: [0, 1, 2],
      editDataRules,
      baseUrl: service.defaults.baseURL
    }
  },
  created() {
    if (this.$route.name === 'profile') {
      this.displayInit(this.$store.state.user.id)
    } else if (this.$route.name === 'editUser') {
      Object.keys(this.profile).forEach(item => {
        if (item == 'name') {
          this.profile.name = this.$route.params.username;
        } else {
          this.profile[item] = this.$route.params[item]
        }
        if (item == 'head_image') {
          this.profile.head_image = (this.$route.params[item].replace(/(http:\/\/||https:\/\/)/,'').split('/').splice(1).toString().replace(/,/g,'/'))
        }
      })
    }
  },
  methods: {
    async upLoad(file) {
      const formData = new FormData()
      formData.append('headImage', file.file)
      try {
        const req = await uploadHeadImage(formData)
        if (Number(req.code) === 0) {
          this.profile.head_image = req.data.image_compress
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
    async displayInit(id) {
      const req = await getInfo(id)
      Object.keys(req.data).forEach(item => {
        
        if (item == 'username') {
          this.profile['name'] = req.data[item]
        } else {
          this.profile[item] = req.data[item]
        }
        if (item == 'head_image') {
          this.profile['head_image'] = req.data[item].replace(/(http:\/\/||https:\/\/)/,'').split('/').splice(1).toString().replace(/,/g,'/')
          // console.log(req.data[item].replace(/\w+:\/\/\d+\.\d+\.\d+\.\d+:\d+\//, ''))
        }
      })
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
    submitUser() {
      if (this.$route.name === 'profile' || this.$route.name === 'editUser') {
        this.modifyUser();
      } else if (this.$route.name === 'addUser') {
        this.addUser();
      }
    },
    modifyUser() {
      this.$refs['profile'].validate(async(valid) => {
        if (valid) {
          this.modifyLoading = true
          const req = await editSubmit(this.profile)
          this.modifyLoading = false
          if (req.code == 0) {
            this.$message.success(req.msg)
          } else {
            this.$message.error(req.msg)
          }
        } else {
          return false
        }
      })
    },
    addUser() {
      this.$refs['profile'].validate(async(valid) => {
        if (valid) {
          this.modifyLoading = true
          const req = await addUser(this.profile)
          this.modifyLoading = false
          if (req.code == 0) {
            this.$message.success(req.msg)
          } else {
            this.$message.error(req.msg)
          }
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
