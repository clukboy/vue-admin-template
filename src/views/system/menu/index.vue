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
        <el-table v-loading="loading" :data="menuList" style="width: 100%;">
          <el-table-column prop="name" label="菜单名称" align="center" />
          <el-table-column prop="permission" label="权限标识" align="center" />
          <el-table-column prop="menu_type" label="菜单类型" align="center" />
          <el-table-column prop="path" label="路由地址" align="center" />
          <el-table-column prop="icon" label="菜单图标" align="center" />
          <el-table-column prop="component" label="组件路径" align="center" />
          <el-table-column prop="status" label="菜单状态" align="center" />
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
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-select v-model="form.parentId" placeholder="请选择">
                <el-option
                  v-for="item in parentMenu"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio v-for="dict in menuTypeDictDatas" :key="parseInt(dict.value)" :label="parseInt(dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type !== '3'" label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.type === '2'" :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.type !== '1'" label="权限标识">
              <el-input v-model="form.permission" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in []"
                  :key="dict.value"
                  :label="parseInt(dict.value)"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
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
import { listMenu, updateMenu, createMenu, removeMenu } from '@/api/system/menu'

export default {
  name: 'Menu',
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
      // 表单校验
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      total: 0,
      search: {
        keyWord: '',
        page: 1,
        pageSize: 10
      },
      menuList: [],
      parentMenu: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      menuTypeDictDatas: [{
        value: '1',
        label: '菜单'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {

    getList() {
      this.loading = true
      listMenu(this.search).then(response => {
        if (response.code !== 200) {
          return
        }
        this.menuList = response.data.list
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
      this.title = '修改菜单信息'
      this.form = {
        ...row
      }
      this.open = true
    },
    /** 新增按钮操作 */
    handlerAdd() {
      this.reset()
      this.title = '添加菜单信息'
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
        return removeMenu(ids).then(response => {
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
          updateMenu(this.form).then(response => {
            if (response.code === 200) {
              this.$message.success('修改成功')
              this.getList()
              this.open = false
            }
          })
        } else {
          createMenu(this.form).then(response => {
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
