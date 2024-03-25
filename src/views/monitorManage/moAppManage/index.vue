<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable ref="proTable" row-key="id" :indent="20" :columns="columns" :request-auto="true" :request-api="pageAppListApi" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增应用</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteProjectInfo(scope.row.id)">删除</el-button>
        </template>
      </ProTable>
      <MoAppDrawer ref="moApp_drawerRef" />
    </div>
  </div>
</template>
<script setup lang="ts" name="MoAppManage">
import { ref, reactive, onMounted } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import { saveAppInfoApi, removeAppInfoByIdApi, pageAppListApi } from "@/api/modules/monitor/moAppApi";
import { MoApp } from "@/api/interface/monitor/moApp";
import ProTable from "@/components/ProTable/index.vue";
import MoAppDrawer from "./moAppDrawer.vue";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
// 获取 ProTable 实例
import { Project } from "@/api/interface/monitor/project";
import { pageProjectListApi } from "@/api/modules/monitor/projectApi";
import { Dict } from "@/api/interface/dict";
const proTable = ref<ProTableInstance>();
let projectData = ref<Project.ProjectInfo[]>([]);
const projectDataEnum = ref<Dict.DictData[]>([]);
onMounted(async () => {
  let { data } = await pageProjectListApi({ pageNum: 1, pageSize: 100 });
  projectData.value = data.records;
  projectData.value.forEach(item => {
    projectDataEnum.value.push({ label: item.name, value: item.id });
  });
});

// 表格配置项
const columns = reactive<ColumnProps<MoApp.MoAppInfo>[]>([
  { type: "index", label: "序号", width: 80 },
  { prop: "appName", label: "应用名称", align: "left", search: { el: "input", props: { placeholder: "请输入应用名称" } } },
  { prop: "appKey", label: "应用标识", align: "left", search: { el: "input", props: { placeholder: "请输入应用标识" } } },
  { prop: "projectId", label: "所属项目", align: "left", enum: projectDataEnum, search: { el: "select", props: { placeholder: " 请选择所属项目" } } },
  { prop: "createTime", label: "创建时间", align: "left" },
  { prop: "operation", label: "操作", width: 350 }
]);

// 打开 drawer(新增、查看、编辑)
const moApp_drawerRef = ref<InstanceType<typeof MoAppDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<MoApp.MoAppInfo> = {}) => {
  const params = { title, row: { ...row, projectDataEnum: projectDataEnum.value }, isView: title === "查看", api: title === "新增" ? saveAppInfoApi : title === "编辑" ? saveAppInfoApi : undefined, getTableList: proTable.value?.getTableList };
  moApp_drawerRef.value?.acceptParams(params);
};

const deleteProjectInfo = (appId: string) => {
  ElMessageBox.confirm(`是否确认删除该应用?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    let res = await removeAppInfoByIdApi(appId);
    if (res.state === 200) {
      ElMessage.success(res.message);
    } else {
      ElMessage.error(res.message);
    }
    proTable.value?.getTableList();
  });
};
</script>
