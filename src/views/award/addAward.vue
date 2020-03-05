<template>
  <div id="AddAward">
    <el-form ref="form" class="AddAward" :model="form" :rules="awardRule">
      <el-form-item prop="name" label="项目名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item prop="time" label="时间">
        <el-date-picker
          v-model="form.time"
          type="date"
          placeholder="选择日期"
          format="yyyy/MM/dd"
          value-format="yyyy/MM/dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button v-loading="submitLoading" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addAward } from '@/api/award'
import awardRule from '@/views/award/rules/index'
export default {
  name: 'AddAward',
  data() {
    return {
      form: {
        name: '',
        time: ''
      },
      submitLoading: false,
      awardRule
    }
  },
  methods: {
    async submit() {
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          this.submitLoading = true
          const req = await addAward(this.form)
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

<style scoped>
.AddAward {
  width: 480px;
  margin-left: 32px;
}
</style>
