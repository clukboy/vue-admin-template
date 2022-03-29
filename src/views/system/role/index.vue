<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <span style="font-size: smaller">关键字：</span>
        <el-input v-model="search.keyWord" clearable placeholder="请输入关键字" size="small" style="width: 80%" />
      </el-col>
      <el-col :span="8">
        <el-button type="primary" size="small" icon="el-icon-search" @click="getList">
          查 询
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-search" @click="handlerAdd">
          添 加
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table v-loading="loading" :data="roleList" style="width: 100%;">
          <el-table-column prop="name" label="名称" align="center" />
          <el-table-column prop="code" label="权限字符串" align="center" />
          <el-table-column label="状态" align="center" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="0"
                :inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center" />
          <el-table-column prop="sort" label="显示顺序" align="center" />
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-pagination background layout="prev, pager, next" style="float: right;" :total="total" />
      </el-col>
    </el-row>
    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色标识" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="sort">
          <el-switch
            v-model="form.status"
            :active-value="0"
            :inactive-value="1"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createRole, listRole, removeRole, updateRole } from '@/api/system/role'

export default {
  name: 'User',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 是否现实弹出层
      open: false,
      sexDictDatas: [{
        id: '1',
        value: 1
      }],
      // 弹出层标题
      title: '',

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '角色标识不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      },
      total: 0,
      search: {
        keyWord: '',
        page: 1,
        pageSize: 10
      },
      roleList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {

    getList() {
      this.loading = true
      listRole(this.search).then(response => {
        if (response.code !== 200) {
          return
        }
        this.roleList = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    /** 取消按钮 */
    cancel() {
      this.open = false
      this.reset()
    },
    /** 新增按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.title = '修改角色信息'
      this.form = {
        ...row
      }
      this.open = true
    },
    /** 新增按钮操作 */
    handlerAdd() {
      this.reset()
      this.title = '添加角色信息'
      this.open = true
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      debugger
      const ids = row.id || this.ids
      this.$confirm(`是否确认删除该角色"${row.name}"的数据项?`, '删除角色',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        return removeRole(ids).then(response => {
          if (response.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 更新
        if (this.form.id) {
          updateRole(this.form).then(response => {
            if (response.code === 200) {
              this.$message.success('修改成功')
              this.getList()
              this.open = false
            }
          })
        } else {
          createRole(this.form).then(response => {
            if (response.code === 200) {
              this.$message.success('添加成功')
              this.getList()
              this.open = false
            }
          })
        }
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      // 此时，row 已经变成目标状态了，所以可以直接提交请求和提示
      const text = row.status === true ? '启用' : '停用'
      this.$confirm(`确认要${text}"${row.name}"角色吗?`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        return updateRole(row).then(response => {
          if (response.code === 200) {
            this.$message.success('修改状态成功')
            this.getList()
          }
        })
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        code: undefined,
        sort: 0,
        status: 0,
        remark: ''
      }
    }
  }
}
</script>
<style>
</style>
