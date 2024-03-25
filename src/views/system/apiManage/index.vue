<template>
  <div class="main-box">
    <TreeFilter label="appName" title="应用列表" :data="appList" :default-value="defaulAppId" @change="changeTreeFilter" />
    <div class="table-box">
      <ProTable ref="proTable" row-key="id" :indent="20" :columns="columns" :request-auto="false" :request-api="pageApiInfo" :init-param="pageApiListParams" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增接口</el-button>
          <el-button type="primary" :icon="Delete" @click="deleteApi(true)">删除</el-button>
          <el-button type="primary" :icon="Upload" plain>限流配置</el-button>
          <el-button type="primary" :icon="Download" plain @click="permissionConfig('权限配置', undefined, true)">权限配置</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteApi(false, scope.row)">删除</el-button>
          <el-button type="primary" link :icon="Delete">限流配置</el-button>
          <el-button type="primary" link :icon="Delete" @click="permissionConfig('权限配置', scope.row, false)">权限配置</el-button>
        </template>
      </ProTable>
      <ApiDrawer ref="drawerRef" />
      <ApiPermissionDrawer ref="apiPermissionDrawerRef" @close="closeApiPermissionDrawer" />
    </div>
  </div>
</template>
<script setup lang="ts" name="useTreeFilter">
import { ref, reactive, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Application } from "@/api/interface/application";
import { Api } from "@/api/interface/apiInfo";
import { queryApplicationList } from "@/api/modules/appApi";
import { pageApiInfo, saveApiInfo, removeApiInfosApi } from "@/api/modules/apiManageApi";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { saveBindRoleApi, queryRoleListByBindApi } from "@/api/modules/roleApi";
import ProTable from "@/components/ProTable/index.vue";
import ApiDrawer from "./apiDrawer.vue";
import ApiPermissionDrawer from "./apiPermissionDrawer.vue";
import { CirclePlus, Delete, EditPen, Download, Upload } from "@element-plus/icons-vue";
import { useHandleData } from "@/hooks/useHandleData";
// 获取 ProTable 实例
const proTable = ref<ProTableInstance>();
const initParam = reactive<Application.QueryListParams>({});
const defaulAppId = ref<string>("");
const appList = ref<Application.ApplicationInfo[]>();
const currentSelectApiIds = ref<string[]>([]);
/**
 * 定义用户列表查询参数: 作为proTable的初始化参数（initParam），分页参数不用定义，会自动加上。
 * 只要pageUserListParams中的属性发生变动，会自动触发列表数据查询
 */
const pageApiListParams = reactive<Api.RequestApiPage>({
  appId: "",
  appName: ""
});
onBeforeMount(async () => {
  const { data, state, message } = await queryApplicationList(initParam);
  if (state === 200) {
    appList.value = [...data];
    defaulAppId.value = appList?.value[0]?.id;
    pageApiListParams.appId = appList?.value[0]?.id;
    pageApiListParams.appName = appList?.value[0]?.appName;
  } else {
    ElMessage.error({ message: message });
  }
});
/**
 * 点击属性节点的回调当方法
 * @param node 属性节点对象
 */
const changeTreeFilter = (node: { [key: string]: any }) => {
  pageApiListParams.appId = node.id;
  pageApiListParams.appName = node.appName;
  proTable.value!.pageable.pageNum = 1;
  console.log(pageApiListParams);
};

// 表格配置项
const columns = reactive<ColumnProps<Api.ApiInfo>[]>([
  { type: "index", label: "序号", width: 80 },
  { type: "selection", fixed: "left", width: 70 },
  { prop: "modelName", label: "接口模块", align: "left", width: 180, search: { el: "input", props: { placeholder: "请输入用户名" } } },
  { prop: "name", label: "接口名称", align: "left", width: 200, search: { el: "input", props: { placeholder: "请输入接口名称" } } },
  { prop: "apiMethod", label: "接口类型", align: "left", width: 200, search: { el: "input", props: { placeholder: "请输入接口类型" } } },
  { prop: "patternPre", label: "接口前缀", align: "left", width: 200, search: { el: "input", props: { placeholder: "请输入接口路径" } } },
  { prop: "pattern", label: "接口路径", align: "left", search: { el: "input", props: { placeholder: "请输入接口路径" } } },
  { prop: "operation", label: "操作", width: 350 }
]);

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof ApiDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Api.ApiInfo> = {}) => {
  if (!pageApiListParams.appId) {
    ElMessage.warning("请先选择接口所属应用！");
    return;
  }
  const params = { title, row: { ...row, appId: pageApiListParams.appId, appName: pageApiListParams.appName }, isView: title === "查看", api: title === "新增" ? saveApiInfo : title === "编辑" ? saveApiInfo : undefined, getTableList: proTable.value?.getTableList };
  drawerRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const apiPermissionDrawerRef = ref<InstanceType<typeof ApiPermissionDrawer> | null>(null);
const permissionConfig = async (title: string, row: Partial<Api.ApiInfo> = {}, batchFlag: boolean) => {
  if (!pageApiListParams.appId) {
    ElMessage.warning("请先选择接口所属应用！");
    return;
  }
  if (batchFlag && proTable.value!.selectedListIds!.length <= 0) {
    ElMessage.warning("请先选择需要授权的接口");
    return;
  }
  currentSelectApiIds.value = batchFlag ? proTable.value!.selectedListIds : [row.id!];
  let { data } = await queryRoleListByBindApi(row.id!);
  let roleIds = data.map(item => item.id);
  const params = { title, row: { ...row, appId: pageApiListParams.appId, appName: pageApiListParams.appName, roleIds: roleIds, apiIds: currentSelectApiIds.value }, isView: title === "查看", api: saveBindRoleApi, getTableList: proTable.value?.getTableList };
  apiPermissionDrawerRef.value?.acceptParams(params);
};
/**
 * 关闭授权页面的回调，清空表格选择
 */
const closeApiPermissionDrawer = () => {
  proTable.value?.clearSelection();
};
/**
 * 删除接口
 * @param apiId 接口ID
 */
const deleteApi = async (batchFlag: boolean, row?: Api.ApiInfo) => {
  currentSelectApiIds.value = batchFlag ? proTable.value!.selectedListIds : [row!.id!];
  if (currentSelectApiIds.value.length > 0) {
    await useHandleData(removeApiInfosApi, currentSelectApiIds.value, `删除接口`);
    proTable.value?.getTableList();
  } else {
    ElMessage.warning("请先选择需要删除的接口");
  }
};
</script>
