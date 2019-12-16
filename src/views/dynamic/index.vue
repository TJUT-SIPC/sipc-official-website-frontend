
<template>
  <div id="DynamicsTable">
    <el-table :data.sync="dynamics_list" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="标题" width="128" prop="header" />
      <el-table-column label="作者" width="100" prop="editor" />
      <el-table-column label="文章" width="420">
          <template slot-scope="scope">
              {{ scope.row.text | dynamicFilter }}
          </template>
      </el-table-column>
      <el-table-column label="时间" width="200" prop="time" />
      <el-table-column label="操作" width="350">
          <template slot-scope="scope">
              <el-row :gutter="1">
                  <el-col :span="6">
                     <el-button type="primary" @click="edit(scope)">编辑</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button type="primary" @click="quickEdit(scope)">快速编辑</el-button>   
                  </el-col>
                  <el-col :span="6">
                    <el-button type="primary" @click="openDeletePrompt(scope)">删除</el-button>
                  </el-col>
              </el-row>
          </template>
      </el-table-column>
    </el-table>
    <el-dialog title="快速编辑" :visible.sync="editVisible">
      <el-form ref="editData" :model="editData" v-loading="editLoading" label-width="80px">
        <el-form-item>
            <el-form-item label="标题">
                <el-input v-model="editData.header"></el-input>
            </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="4">
            <el-col :span="12">
              <el-button type="primary" @click="editSubmit">提交</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="editCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="deletePrompt">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletePrompt = false">取 消</el-button>
        <el-button type="primary" @click="delDynamic">确 定</el-button>
      </span>
    </el-dialog>
	<el-pagination
      :page-size="page_size"
      :pager-count="11"
      layout="prev, pager, next"
      :current-page="current_page"
	    @current-change="pageChange"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { modifyDynamic, delDynamic, getDynamics } from '@/api/dynamic'
import { dynamicFilter } from '@/views/dynamic/filter/dynamicFilter'
export default {
  name: 'DynamicsTable',
  filters: {
      dynamicFilter
  },
  data() {
    return {
      page_size: 9,
      total: 0,
      current_page: 1,
      dynamics_list: [],
      editVisible: false, // 快速编辑界面是否显示
      editLoading: false, // 快速编辑界面是否处于加载中
      editData: { // 快速编辑中的表单
        id: undefined,
        header: '',
        text: '',
        time: '',
        editor: '',
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
    this.displayDynamicsList(this.$route.query.page, this.page_size)
  },
  methods: {
    displayDynamicsList(page, pageSize, status) {
      getDynamics(page, pageSize, status).then(data => {
        data.data.dynamics_list.forEach((item, key) => {
          item.$index = key
          this.dynamics_list.push(item)
        })
        this.total = Number(data.data.total)
      })
    },
    pageChange(page) {
      this.$router.replace('?page=' + page)
    },
    edit(scope) {
      this.$router.push({name: 'editDynamic', params: {
        id: scope.row.id,
        editor: scope.row.editor,
        text: scope.row.text,
        header: scope.row.header,
        time: scope.row.time,
        image: scope.row.image
      }})
    },
    quickEdit(scope) {
      this.editData.id = scope.row.id
      this.editData.header = scope.row.header
      this.editData.text = scope.row.text
      this.editData.image = scope.row.image
      this.editData.editor = scope.row.editor
      this.editData.time = scope.row.time
      this.editVisible = true
    },
    openDeletePrompt(scope) {
      this.deletePrompt = true
      this.deletePrompt_data.$index = scope.$index
      this.deletePrompt_data.id = scope.row.id
    },
    async delDynamic() {
      const req = await delDynamic(this.deletePrompt_data.id)
      this.dynamics_list.splice(this.deletePrompt_data.$index, 1)
      this.deletePrompt = false
    },
    async editSubmit() {
      this.$refs['editData'].validate(async(valid) => {
        if (valid) {
          this.editLoading = true
          const req = await modifyDynamic(this.editData)
          Object.keys(this.editData).forEach(item => {
            if (item !== '$index') {
              this.dynamics_list[this.editData.$index][item] = this.editData[item]
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
  },
  beforeRouteEnter(to, from, next) {
    if (!to.query.page) {
      next(to.path + '?page=1')
    } next()
  },
  beforeRouteUpdate(to, from, next) {
    // 只有点击页面底部el-pagination时才会触发
    if (to.query.page) {
      this.dynamics_list = []
      this.displayDynamicsList(to.query.page, this.page_size)
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
