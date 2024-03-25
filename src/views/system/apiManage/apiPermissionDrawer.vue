<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="800px" :title="`${drawerProps.title}：${drawerProps.row.appName}>${drawerProps.row.modelName}>${drawerProps.row.name}`">
    <ProTable ref="proTable" :request-api="pageRoleListApi" :init-param="pageRoleListParams" row-key="id" table-height="650px" :pagination="true" :tool-button="false" :indent="20" :columns="columns" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }" @selection-change="selectRoleChange"></ProTable>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button @click="selectAll">全选</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="ApiPermissionDrawer">
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { Api } from "@/api/interface/apiInfo";
import { Role } from "@/api/interface/roleInfo";
import ProTable from "@/components/ProTable/index.vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { pageRoleListApi } from "@/api/modules/roleApi";
// 获取 ProTable 实例
const proTable = ref<ProTableInstance>();
// 选择标识（如果没有修改，则无需提交） 默认为false
const editFlag = ref<boolean>(false);
const pageRoleListParams = reactive<Role.RequestPage>({
  appId: "",
  appName: ""
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Api.ApiInfo>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

// 表格配置项
const columns = reactive<ColumnProps<Role.RoleInfo>[]>([
  { type: "index", label: "序号", width: 80 },
  { type: "selection", fixed: "left", width: 70 },
  { prop: "name", label: "角色名称", search: { el: "input", props: { placeholder: "请输入角色名称" } } },
  { prop: "roleKey", label: "角色标识", search: { el: "input", props: { placeholder: "请输入角色标识" } } },
  { prop: "appName", label: "所属应用" }
]);

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

/**
 * 找出需要回显的数据，进行表格回显
 */
const selectAll = () => {
  let tableData = proTable.value?.tableData;
  let roleIds = drawerProps.value.row.roleIds;
  let selectData = tableData?.filter(item => roleIds?.includes(item.id));
  selectData?.forEach(item => {
    proTable.value?.element?.toggleRowSelection(item, true);
  });
};

// 监听页面 initParam 改化，重新获取表格数据
watch(() => proTable.value?.tableData, selectAll, { deep: true });

/**
 * 保存权限
 */
const handleSubmit = async () => {
  if (!editFlag.value) {
    ElMessage.warning({ message: "数据未变动！" });
    return;
  }
  let params = {
    bindIds: drawerProps.value.row.apiIds,
    roleIds: proTable.value?.selectedListIds,
    bindType: 5
  };
  await drawerProps.value.api!(params);
  ElMessage.success({ message: `${drawerProps.value.title}成功！` });
  proTable.value?.clearSelection();
  drawerVisible.value = false;
};

const selectRoleChange = () => {
  editFlag.value = true;
};

defineExpose({
  acceptParams
});
</script>
