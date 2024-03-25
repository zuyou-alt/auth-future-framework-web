<template>
  <div class="main-box">
    <TreeFilter label="appName" title="应用列表" :data="appList" :default-value="defaulAppId" @change="changeTreeFilter" />
    <div class="table-box">
      <ProTable ref="proTable" row-key="id" :indent="20" :columns="columns" :request-auto="false" :request-api="pageRoleListApi" :init-param="pageRoleListParams" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增角色</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openResourceDrawer('资源授权', scope.row)">资源授权</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openOrgDrawer('组织授权', scope.row)">组织授权</el-button>
          <el-button type="primary" link :icon="EditPen" @click="openUserDrawer('用户授权', scope.row)">用户授权</el-button>
          <el-button type="primary" link :icon="Delete" @click="deletRole(scope.row.id)">删除</el-button>
        </template>
      </ProTable>
      <RoleInfoDrawer ref="drawerRef" />
      <ResourceDrawer v-if="resourceDrawerFlag" ref="resourceDrawerRef" />
      <OrgDrawer ref="orgDrawerRef" />
      <UserDrawer ref="userDrawerRef" />
    </div>
  </div>
</template>
<script setup lang="ts" name="useTreeFilter">
import { ref, reactive, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
// 左侧树相关
import { Application } from "@/api/interface/application";
import TreeFilter from "@/components/TreeFilter/index.vue";
// 列表相关
import ProTable from "@/components/ProTable/index.vue";
import { pageRoleListApi, saveRoleApi, removeRoleApi, saveRoleBindApi, saveRoleBindUserApi } from "@/api/modules/roleApi";
import { Role } from "@/api/interface/roleInfo";
import { Org } from "@/api/interface/org";
import RoleInfoDrawer from "./roleInfoDrawer.vue";
import ResourceDrawer from "./resourceDrawer.vue";
import OrgDrawer from "./orgDrawer.vue";
import UserDrawer from "./userDrawer.vue";
import { getMenuListByRoleIdApi, getOrgListByRoleIdApi } from "@/api/modules/roleApi";
import { queryApplicationList } from "@/api/modules/appApi";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
// 获取 ProTable 实例
const proTable = ref<ProTableInstance>();
const initParam = reactive<Application.QueryListParams>({});
const defaulAppId = ref<string>("");
const appList = ref<Application.ApplicationInfo[]>();
const currentNode = reactive<Role.RequestPage>({});
const resourceDrawerFlag = ref<boolean>(false);
const orgDrawerFlag = ref<boolean>(false);
/**
 * 定义用户列表查询参数: 作为proTable的初始化参数（initParam），分页参数不用定义，会自动加上。
 * 只要pageUserListParams中的属性发生变动，会自动触发列表数据查询
 */
const pageRoleListParams = reactive<Role.RequestPage>({
  appId: "",
  appName: ""
});
onBeforeMount(async () => {
  const { data } = await queryApplicationList(initParam);
  appList.value = [...data];
  defaulAppId.value = appList?.value[0]?.id;
  pageRoleListParams.appId = appList?.value[0]?.id;
  currentNode.appName = appList?.value[0]?.appName;
});

/**
 * 点击属性节点的回调当方法
 * @param node 属性节点对象
 */
const changeTreeFilter = (node: { [key: string]: any }) => {
  pageRoleListParams.appId = node.id;
  proTable.value!.pageable.pageNum = 1;
  currentNode.appName = node.appName;
};

// 表格配置项
const columns = reactive<ColumnProps<Role.RoleInfo>[]>([
  { type: "index", label: "序号", width: 80 },
  { prop: "name", label: "角色名称", align: "left", search: { el: "input", props: { placeholder: "请输入角色名称查询" } } },
  { prop: "roleKey", label: "角色标识", align: "left" },
  { prop: "appName", label: "所属应用", align: "left" },
  { prop: "createTime", label: "创建时间", align: "left" },
  { prop: "operation", label: "操作", width: 450 }
]);

const deletRole = async (roleId: string) => {
  ElMessageBox.confirm(`是否确认删除该角色?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    let res = await removeRoleApi(roleId);
    if (res.state === 200) {
      ElMessage.success(res.message);
    } else {
      ElMessage.error(res.message);
    }
    proTable.value?.getTableList();
  });
};

/**
 * 打开角色添加和编辑界面
 */
const drawerRef = ref<InstanceType<typeof RoleInfoDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Role.RoleInfo> = {}) => {
  if (!pageRoleListParams.appId) {
    ElMessage.warning("请先选择接口所属应用！");
    return;
  }
  const params = { title, row: { ...row, appId: pageRoleListParams.appId, appName: currentNode.appName }, isView: title === "查看", api: title === "新增" ? saveRoleApi : title === "编辑" ? saveRoleApi : undefined, getTableList: proTable.value?.getTableList };
  drawerRef.value?.acceptParams(params);
};

/**
 * 打开资源授权界面
 */
const resourceDrawerRef = ref<InstanceType<typeof ResourceDrawer> | null>(null);
const openResourceDrawer = async (title: string, row: Partial<Role.RoleInfo> = {}) => {
  if (!pageRoleListParams.appId) {
    ElMessage.warning("请先选择角色所属应用！");
    return;
  }
  resourceDrawerFlag.value = true;
  // 获取需要选中的资源
  const res = await getMenuListByRoleIdApi(row.id!);
  let menuIdList: string[] = [];
  res.data.forEach(item => {
    if (item.menuType === "menu") {
      return menuIdList.push(item.id!);
    }
  });
  const params = { title, row: { ...row, appId: pageRoleListParams.appId, appName: currentNode.appName, menuIdList: menuIdList! }, isView: title === "查看", api: saveRoleBindApi, getTableList: proTable.value?.getTableList };
  resourceDrawerRef.value?.acceptParams(params);
};

/**
 * 打开组织授权界面
 */
const orgDrawerRef = ref<InstanceType<typeof ResourceDrawer> | null>(null);
const openOrgDrawer = async (title: string, row: Partial<Org.OrgInfo> = {}) => {
  if (!pageRoleListParams.appId) {
    ElMessage.warning("请先选择角色所属应用！");
    return;
  }
  orgDrawerFlag.value = true;
  // 获取需要选中的组织
  const res = await getOrgListByRoleIdApi(row.id!);
  let orgList: string[] = res.data.map(item => item.id);
  const params = { title, row: { ...row, appId: pageRoleListParams.appId, appName: currentNode.appName, orgList: orgList }, isView: title === "查看", api: saveRoleBindApi, getTableList: proTable.value?.getTableList };
  orgDrawerRef.value?.acceptParams(params);
};

/**
 * 打开用户授权界面
 */
const userDrawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openUserDrawer = async (title: string, row: Partial<Org.OrgInfo> = {}) => {
  if (!pageRoleListParams.appId) {
    ElMessage.warning("请先选择角色所属应用！");
    return;
  }
  orgDrawerFlag.value = true;
  // 获取需要选中的组织
  // const res = await getOrgListByRoleIdApi(row.id!);
  // let orgList: string[] = res.data.map(item => item.id);
  const params = { title, row: { ...row, appId: pageRoleListParams.appId, appName: currentNode.appName }, isView: title === "查看", api: saveRoleBindUserApi, getTableList: proTable.value?.getTableList };
  userDrawerRef.value?.acceptParams(params);
};
</script>
