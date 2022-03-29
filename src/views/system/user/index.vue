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
        <el-table v-loading="loading" :data="userList" style="width: 100%;">
          <el-table-column prop="nickname" label="用户昵称" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="sex" label="性别" align="center" />
          <el-table-column prop="mobile" label="电话" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column prop="status" label="状态" align="center" />
          <el-table-column prop="remark" label="备注" align="center" />
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
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="form.nickname" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.id === undefined" label="用户名称" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.id === undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexDictDatas"
                  :key="parseInt(dict.value)"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listUser, updateUser, createUser, removeUser } from '@/api/system/user'

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
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        email: [
          {
            type: 'email',
            message: '\'请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },

      total: 0,
      search: {
        keyWord: '',
        page: 1,
        pageSize: 10
      },
      userList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {

    getList() {
      this.loading = true
      listUser(this.search).then(response => {
        if (response.code !== 200) {
          return
        }
        this.userList = response.data.list
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
      this.title = '修改用户信息'
      this.form = {
        ...row
      }
      this.open = true
    },
    /** 新增按钮操作 */
    handlerAdd() {
      this.reset()
      this.title = '添加用户信息'
      this.open = true
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      debugger
      const ids = row.id || this.ids
      this.$confirm(`是否确认删除用户编号"${row.username}"的数据项?`, '删除用户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        return removeUser(ids).then(response => {
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
          updateUser(this.form).then(response => {
            if (response.code === 200) {
              this.$message.success('修改成功')
              this.getList()
              this.open = false
            }
          })
        } else {
          createUser(this.form).then(response => {
            if (response.code === 200) {
              this.$message.success('添加成功')
              this.getList()
              this.open = false
            }
          })
        }
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        deptId: undefined,
        username: undefined,
        nickname: undefined,
        password: undefined,
        mobile: undefined,
        email: undefined,
        sex: undefined,
        status: true,
        remark: undefined
      }
    }
  }
}
</script>
<style>
</style>
