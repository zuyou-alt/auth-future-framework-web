<template>
  <div class="main-box">
    <TreeFilter ref="orgTreeRef" label="name" title="组织列表" :request-api="getOrgListByParentIdApi" :multiple="multipleOrg" :lazy="true" @change="clickOrgNode" @select-default-event="selectDefaultHandler" />
    <div class="table-box">
      <ProTable ref="proTable" row-key="id" :indent="20" :columns="columns" :request-auto="false" :request-api="pageUserListApi" :init-param="pageUserListParams" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
          <el-button type="primary" :icon="Refresh" @click="batchResetPwd">重置密码</el-button>
          <el-button type="primary" :icon="Unlock" @click="batchUnlockUser">解锁用户</el-button>
          <el-button type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>
          <el-button type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <!-- <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button> -->
          <!-- 以下操作只能在用户的归属组织下进行。挂职是不允许修改用户相关信息的 -->
          <el-button v-if="scope.row.relevancyOrgType === '1'" type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button v-if="scope.row.relevancyOrgType === '1'" type="primary" link :icon="EditPen" @click="updateUserIdentity('身份变更', scope.row)">身份变更</el-button>
          <el-button v-if="scope.row.relevancyOrgType === '1'" type="primary" link :icon="EditPen" @click="userOrgEdit('组织修改', scope.row)">组织变更</el-button>
          <el-button v-if="scope.row.relevancyOrgType === '1'" type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
        </template>
      </ProTable>
      <UserDrawer ref="drawerRef" />
      <ImportExcel ref="dialogRef" />
      <UserOrgDrawer ref="userOrgDrawerRef" />
      <UserIdentityDialog ref="userIdentityDialogRef" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="treeProTable">
import { reactive, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "./UserDrawer.vue";
import UserOrgDrawer from "./userOrgDrawer.vue";
import UserIdentityDialog from "./userIdentityDialog.vue";
import { CirclePlus, Delete, EditPen, Download, Upload, Refresh, Unlock } from "@element-plus/icons-vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { removeUsers, saveUser, exportUserInfo, BatchAddUser, pageUserListApi, batchResetPasswordApi, batchUnlockUserApi } from "@/api/modules/user";
import { getOrgListByParentIdApi } from "@/api/modules/orgApi";
import { onMounted } from "vue";

// 获取树形实例
const orgTreeRef = ref<InstanceType<typeof TreeFilter> | null>(null);
// 获取 ProTable 实例
const proTable = ref<ProTableInstance>();
const multipleOrg = ref<boolean>(false);
// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let userIdentityEnum = ref<Dict.DictData[]>([]);
let userGenderEnum = ref<Dict.DictData[]>([]);
let userStatusEnum = ref<Dict.DictData[]>([]);
let userOrgTypeEnum = ref<Dict.DictData[]>([]);
onMounted(async () => {
  let { data } = await getBatchDict(["user_identity", "user_gender", "user_status", "user_org_type"]);
  userIdentityEnum.value = data.filter(item => item.dictType === "user_identity")[0].dictDataCommonList;
  userGenderEnum.value = data.filter(item => item.dictType === "user_gender")[0].dictDataCommonList;
  userStatusEnum.value = data.filter(item => item.dictType === "user_status")[0].dictDataCommonList;
  userOrgTypeEnum.value = data.filter(item => item.dictType === "user_org_type")[0].dictDataCommonList;
  userStatusEnum.value.forEach(item => (item.value = parseInt(item.value!)));
});

// 用户列表初始化查询参数对象
const pageUserListParams = reactive<User.ReqUserParams>({});

/**
 * 点击树形节点的回调
 * @param node 树形节点数据
 */
const clickOrgNode = (node: { [key: string]: any }) => {
  pageUserListParams.relevancyOrgId = node.id;
  pageUserListParams.relevancyOrgName = node.name;
  proTable.value!.pageable.pageNum = 1;
};

/**
 * 监听属性默认选中，默认查询选中组织下的用户
 */
const selectDefaultHandler = node => {
  pageUserListParams.relevancyOrgId = node.id;
  pageUserListParams.relevancyOrgName = node.name;
};

// 表格配置项
const columns = reactive<ColumnProps<User.UserInfo>[]>([
  { type: "selection", label: "序号", width: 80 },
  { type: "index", label: "序号", width: 80 },
  { prop: "account", label: "账号", width: 120, sortable: true, search: { el: "input", props: { placeholder: "请输入用户账号" } } },
  {
    prop: "name",
    label: "姓名",
    width: 120,
    sortable: true,
    search: { el: "input", props: { placeholder: "请输入用户姓名" } },
    render: scope => {
      return (
        <el-button type="primary" link onClick={() => openDrawer("查看", scope.row)}>
          {scope.row.name}
        </el-button>
      );
    }
  },
  { prop: "gender", label: "性别", width: 80, sortable: true, enum: userGenderEnum },
  { prop: "phone", label: "手机号", width: 150, sortable: true, search: { el: "input", props: { placeholder: "请输入用户手机号" } } },
  { prop: "identityStr", label: "用户身份", width: 150, sortable: true },
  { prop: "relevancyOrgType", label: "组织类型", sortable: true, width: 120, enum: userOrgTypeEnum },
  { prop: "relevancyOrgName", label: "当前组织", isShow: false, width: 120 },
  { prop: "relevancyOrgId", label: "组织ID", isHide: true },
  {
    prop: "status",
    label: "用户状态",
    sortable: true,
    isFilterEnum: true,
    width: 120,
    tag: true,
    enum: userStatusEnum,
    search: {
      el: "select",
      props: { placeholder: "请选择用户状态", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  { prop: "createTime", label: "创建时间", sortable: true, width: 180 },
  { prop: "operation", label: "操作" }
]);

/**111
 * 删除用户
 * @param params 用户信息
 */
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(removeUsers, [params.id], `删除【${params.name}】用户`);
  proTable.value?.getTableList();
};

/**
 * 批量重置用户密码
 */
const batchResetPwd = async () => {
  if (proTable.value?.selectedListIds && proTable.value?.selectedListIds.length > 0) {
    await useHandleData(batchResetPasswordApi, proTable.value?.selectedListIds, `重置用户密码`);
  } else {
    ElMessage.warning("请先选择需要重置密码的用户！");
  }
};

/**
 * 批量解锁用户
 */
const batchUnlockUser = async () => {
  if (proTable.value?.selectedListIds && proTable.value?.selectedListIds.length > 0) {
    await useHandleData(batchUnlockUserApi, proTable.value?.selectedListIds, `解锁用户`);
  } else {
    ElMessage.warning("请选择需要解锁的用户");
  }
};

/**
 * 导出用户列表
 */
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() => useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam));
};

/**
 * 导入用户
 */
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: exportUserInfo,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

/**
 * 打开用户新增、编辑、查看页面
 */
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.UserInfo> = {}) => {
  if (!row.relevancyOrgId) {
    ElMessage.warning("请先选择用户的组织！");
    return;
  }
  if (title === "新增") {
    row.id = "";
  }
  const params = { title, row: { ...row, relevancyOrgId: pageUserListParams.relevancyOrgId, relevancyOrgName: pageUserListParams.relevancyOrgName, sourceTo: 2 }, isView: title === "查看", api: title === "新增" ? saveUser : title === "编辑" ? saveUser : undefined, getTableList: proTable.value?.getTableList };
  drawerRef.value?.acceptParams(params);
};

/**
 * 打开用户组织关系编辑页面
 */
const userOrgDrawerRef = ref<InstanceType<typeof UserOrgDrawer> | null>(null);
const userOrgEdit = (title: string, row: Partial<User.UserInfo> = {}) => {
  const params = { title, row: { ...row }, isView: title === "查看", api: title === "新增" ? saveUser : title === "编辑" ? saveUser : undefined, getTableList: proTable.value?.getTableList };
  userOrgDrawerRef.value?.acceptParams(params);
};

/**
 * 打开用户身份变更界面
 */
const userIdentityDialogRef = ref<InstanceType<typeof UserIdentityDialog> | null>(null);
const updateUserIdentity = (title, row: Partial<User.UserInfo> = {}) => {
  const params = { title, row: { ...row }, isView: title === "查看", api: title === "新增" ? saveUser : title === "编辑" ? saveUser : undefined, getTableList: proTable.value?.getTableList };
  userIdentityDialogRef.value?.acceptParams(params);
};
</script>
