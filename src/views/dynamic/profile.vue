<template>
  <div id="profile">
    <el-form ref="form" :model="form" :rules="editRule">
      <el-row :gutter="6">
        <el-col :span="18">
          <el-form-item prop="text">
            <tinymce-editor v-model="form.text" :init="init" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="operate">
            <el-button @click="submit">提交</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item label="图片上传" prop="image">
            <el-upload
              class="uploader"
              action="123"
              :http-request="upLoad"
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <img v-if="form.image" :src="baseUrl+ '/' + form.image" class="avatar" />
              <i v-else class="el-icon-plus uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="标题" prop="header">
            <el-input v-model="form.header" />
          </el-form-item>
          <el-form-item label="作者" prop="editor">
            <el-input v-model="form.editor" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { modifyDynamic, uploadDynamicImage, addDynamic } from "@/api/dynamic";
import editRule from "@/views/dynamic/rules/edit";
import message from "@/utils/message";
import service from '@/utils/request';
import "tinymce/tinymce";
import "tinymce/themes/silver/index";
import "tinymce/skins/ui/oxide/content.css";
import "tinymce/skins/ui/oxide/skin.css";
import Editor from "@tinymce/tinymce-vue";
import "@/assets/langs/zh_CN";
// yyyy-mm-dd
function format(date) {
  const yyyy = date.getFullYear();
  const mm = date.getMonth();
  const dd = date.getDate();
  return `${yyyy}-${mm}-${dd}`;
}
export default {
  name: "Profile",
  components: {
    "tinymce-editor": Editor
  },
  props: ["publicData"],
  data() {
    return {
      use: 0, // 0,添加文章 1,修改文章
      form: {
        id: undefined,
        header: "",
        text: "",
        image: "",
        time: "",
        editor: this.$store.getters.username
      },
      editRule,
      init: {
        language: "zh_CN",
        height: "90vh"
      },
      baseUrl: service.defaults.baseURL
    };
  },
  created() {
    if (this.$route.params.text) {
      this.use = 1;
      Object.keys(this.form).forEach(item => {
        this.form[item] = this.$route.params[item];
      });
    }
  },
  mounted() {},
  methods: {
    async upLoad(file) {
      const formData = new FormData();
      formData.append("dynamicImage", file.file);
      // console.log(formData.get("file"));
      try {
        const req = await uploadDynamicImage(formData);
        if (Number(req.code) === 0) {
          this.form.image = req.data.image_raw;
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
      } catch (err) {
        this.$message({
          type: "error",
          message: "上传失败"
        });
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isJPEG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!(isJPG || isPNG || isJPEG)) {
        this.$message.error("上传头像图片格式应该为jpeg，png或jpg");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      return isLt2M && (isJPG || isPNG || isJPEG);
    },
    async submit() {
      this.$refs["form"].validate(async valid => {
        if (!valid) {
          return false;
        }
        this.form.time = format(new Date());
        let req = null;
        if (this.$route.name == 'editDynamic') {
          req = await modifyDynamic(this.form);
        } else if (this.$route.name == 'addDynamic') {
          req = await  addDynamic(this.form);
        }
        
        message(req);
      });
    },
    reset() {
      this.form.header = "";
      this.form.text = "";
      this.form.image = "";
    }
  }
};
</script>

<style scope>
.el-form {
  width: 99%;
  margin-top: 12px;
}
.el-form .operate .el-button {
  float: right;
  margin-right: 6px;
}
.uploader .el-upload {
  width: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader .el-upload:hover {
  border-color: #409eff;
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 178px;
  display: block;
}
</style>
