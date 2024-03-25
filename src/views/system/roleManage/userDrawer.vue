<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="1000px" :title="`${drawerProps.title}`" :close-on-click-modal="true">
    <div>
      <el-form ref="searchUserFormRef" label-width="100px" label-suffix=" :" :disabled="drawerProps.isView" :model="searchUserForm" :hide-required-asterisk="drawerProps.isView">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户组织" prop="orgStr">
              <el-select v-model="orgStr" placeholder="请选择用户所在组织" style="width: 100%" @visible-change="selectChange">
                <el-input v-model="filterText" placeholder="请输入筛选条件" style="width: 96%; margin: 10px" />
                <el-option :value="searchUserForm.relevancyOrgId!" :label="searchUserForm.relevancyOrgName" style="/* height: 100%; */ min-height: 200px; max-height: 300px; padding: 0; overflow-y: auto; background-color: #ffffff">
                  <el-tree :expand-on-click-node="false" ref="selectTree" lazy :load="loadNode" :props="props" @node-click="handleNodeClick" :filter-node-method="filterNode"> </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="name">
              <el-input v-model="searchUserForm.name" placeholder="请输入用户名" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="searchUserForm.nickName" placeholder="请输入用户昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户账号" prop="account"> <el-input v-model="searchUserForm.account" placeholder="请输入用户账号" clearable></el-input> </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户电话" prop="phone">
              <el-input v-model="searchUserForm.phone" placeholder="请输入用户电话" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户组织" prop="relevancyOrgName">
              <el-input v-model="searchUserForm.relevancyOrgName" placeholder="请输入用户组织名称" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="startTime">
              <el-date-picker v-model="searchUserForm.startTime" type="datetimerange" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">搜索</el-button>
              <el-button @click="resetSearchUserForm(searchUserFormRef)">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <ProTable ref="proTable" :data="userListData" row-key="id" table-height="580px" :pagination="false" :tool-button="false" :indent="20" :columns="columns" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="toAuthUser('编辑', scope.row)">授权</el-button>
      </template>
    </ProTable>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="saveRoleUserAuth">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="orgDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Role } from "@/api/interface/roleInfo";
import { User } from "@/api/interface";
import { View } from "@element-plus/icons-vue";
import { pageUserListApi } from "@/api/modules/user";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import type Node from "element-plus/es/components/tree/src/model/node";
import { getOrgListByParentIdApi } from "@/api/modules/orgApi";
import { Org } from "@/api/interface/org";
const orgStr = ref("");
// 获取 ProTable 实例
const proTable = ref<ProTableInstance>();
// 存储需要选中的值
const defaultValue = ref<string[]>([]);
// 选择标识（如果没有修改，则无需提交） 默认为false
const editFlag = ref<boolean>(false);
// 存储选中的值的ID
// const selectIds = ref<any>([]);
const userListData = ref<User.UserInfo[]>([]);
const searchUserForm = reactive<User.ReqUserParams>({});
/**
 * 下拉树prop
 */
const props = {
  label: "name",
  children: "children",
  isLeaf: "isLeaf"
};

interface Tree {
  [key: string]: any;
}
const filterText = ref("");
/**
 * 异步加载树节点的方法
 * @param node 可指定树节点的根节点ID，默认root
 * @param resolve 树的子节点的结合
 */
const loadNode = async (node: Node, resolve: (data: Tree[]) => any) => {
  const { data } = await getOrgListByParentIdApi({ parentId: node.level === 0 ? "root" : node.data.id });
  return resolve(data);
};

/**
 * 点击下拉树的回调方法
 * @param node 树节点数据
 */
const handleNodeClick = (node: Org.OrgInfo) => {
  searchUserForm.relevancyOrgId = node.id;
  orgStr.value = node.name;
};

const selectChange = () => {
  filterText.value = "";
};

// 过滤
const filterNode = (value: string, data: { [key: string]: any }, node: any) => {
  if (!value) return true;
  let parentNode = node.parent,
    labels = [node.label],
    level = 1;
  while (level < node.level) {
    labels = [...labels, parentNode.label];
    parentNode = parentNode.parent;
    level++;
  }
  return labels.some(label => label.indexOf(value) !== -1);
};

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Role.RoleInfo>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let userOrgTypeEnum = ref<Dict.DictData[]>([]);
// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  defaultValue.value = params.row.orgList!;
  drawerVisible.value = true;
  editFlag.value = false;
  let { data } = await getBatchDict(["user_org_type"]);
  userOrgTypeEnum.value = data.filter(item => item.dictType === "user_org_type")[0].dictDataCommonList;
  // userOrgTypeEnum.value.forEach(item => (item.value = parseInt(item.value!)));
};

/**
 * 点击搜索按钮
 */
const handleSubmit = async () => {
  let res = await pageUserListApi(searchUserForm);
  userListData.value = [...res.data.records];
};

/**
 * 重置搜索
 */
const searchUserFormRef = ref<FormInstance>();
const resetSearchUserForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  orgStr.value = "";
  searchUserForm.relevancyOrgId = "";
};

// 提交数据（新增/编辑）
const saveRoleUserAuth = async () => {
  let sele = proTable.value?.selectedList;
  let userInfoList: any[] = [];
  sele?.forEach(item => {
    let a = { userId: item.id, orgId: item.relevancyOrgId };
    userInfoList.push(a);
  });

  let params = {
    roleId: drawerProps.value.row.id,
    userBindVos: userInfoList,
    bindType: 1 //用户
  };
  await drawerProps.value.api!(params);
  ElMessage.success({ message: `${drawerProps.value.title}成功！` });
  drawerVisible.value = false;
  userListData.value = [];
};

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "index", label: "序号", width: 80 },
  { type: "selection", fixed: "left", width: 70 },
  { prop: "account", label: "账号", width: 120 },
  { prop: "name", label: "姓名", width: 120 },
  { prop: "phone", label: "手机号", width: 150 },
  { prop: "relevancyOrgName", label: "用户组织", sortable: true },
  { prop: "relevancyOrgType", label: "组织关系", enum: userOrgTypeEnum },
  { prop: "relevancyOrgId", label: "组织ID", isShow: false },

  { prop: "operation", label: "操作", fixed: "right" }
]);

const toAuthUser = (title: string, row: Partial<User.ResUserList> = {}) => {
  console.log(title, row);
};

defineExpose({
  acceptParams
});
</script>

<style scoped lang="scss">
.menu_tree_class {
  width: calc(100% - 230px);
}
:deep(.el-tree-node__content) {
  font-weight: 500;
}
</style>
