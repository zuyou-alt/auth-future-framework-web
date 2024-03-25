<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable ref="proTable" row-key="id" :indent="20" :columns="columns" :request-auto="true" :request-api="pageApplicationList" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增应用</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteAppInfo(scope.row.id)">删除</el-button>
        </template>
      </ProTable>
      <ApplicationDrawer ref="application_drawerRef" />
    </div>
  </div>
</template>
<script setup lang="ts" name="u seTreeFilter">
import { ref, reactive } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import { Application } from "@/api/interface/application";
import { pageApplicationList, saveApplication, removeApplicationApi } from "@/api/modules/appApi";
import ProTable from "@/components/ProTable/index.vue";
import ApplicationDrawer from "./applicationDrawer.vue";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
// 获取 ProTable 实例
const proTable = ref<ProTableInstance>();
// 表格配置项
const columns = reactive<ColumnProps<Application.ApplicationInfo>[]>([
  { type: "index", label: "序号", width: 80 },
  { prop: "appName", label: "应用名称", align: "left", search: { el: "input", props: { placeholder: "请输入应用名称" } } },
  { prop: "appKey", label: "应用标识", align: "left", search: { el: "input", props: { placeholder: "请输入应用标识" } } },
  { prop: "appSecret", label: "应用秘钥", align: "left" },
  { prop: "createTime", label: "创建时间", align: "left" },
  { prop: "operation", label: "操作", width: 350 }
]);

// 打开 drawer(新增、查看、编辑)
const application_drawerRef = ref<InstanceType<typeof ApplicationDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Application.ApplicationInfo> = {}) => {
  const params = { title, row: { ...row }, isView: title === "查看", api: title === "新增" ? saveApplication : title === "编辑" ? saveApplication : undefined, getTableList: proTable.value?.getTableList };
  application_drawerRef.value?.acceptParams(params);
};

const deleteAppInfo = (appId: string) => {
  ElMessageBox.confirm(`是否确认删除该应用?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    let res = await removeApplicationApi(appId);
    if (res.state === 200) {
      ElMessage.success(res.message);
    } else {
      ElMessage.error(res.message);
    }
    proTable.value?.getTableList();
  });
};
</script>
