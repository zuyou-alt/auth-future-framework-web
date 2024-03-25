<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable ref="proTable" row-key="id" :indent="20" :columns="columns" :request-auto="true" :request-api="pageProjectListApi" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增项目</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteProjectInfo(scope.row.id)">删除</el-button>
        </template>
      </ProTable>
      <ProjectDrawer ref="project_drawerRef" />
    </div>
  </div>
</template>
<script setup lang="ts" name="u seTreeFilter">
import { ref, reactive } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import { pageProjectListApi, removeProjectApi, saveProjectApi } from "@/api/modules/monitor/projectApi";
import { Project } from "@/api/interface/monitor/project";
import ProTable from "@/components/ProTable/index.vue";
import ProjectDrawer from "./projectDrawer.vue";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
// 获取 ProTable 实例
const proTable = ref<ProTableInstance>();
// 表格配置项
const columns = reactive<ColumnProps<Project.ProjectInfo>[]>([
  { type: "index", label: "序号", width: 80 },
  { prop: "name", label: "项目名称", align: "left", search: { el: "input", props: { placeholder: "请输入项目名称" } } },
  { prop: "createTime", label: "创建时间", align: "left" },
  { prop: "operation", label: "操作", width: 350 }
]);

// 打开 drawer(新增、查看、编辑)
const project_drawerRef = ref<InstanceType<typeof ProjectDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Project.ProjectInfo> = {}) => {
  const params = { title, row: { ...row }, isView: title === "查看", api: title === "新增" ? saveProjectApi : title === "编辑" ? saveProjectApi : undefined, getTableList: proTable.value?.getTableList };
  project_drawerRef.value?.acceptParams(params);
};

const deleteProjectInfo = (appId: string) => {
  ElMessageBox.confirm(`是否确认删除该项目?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    let res = await removeProjectApi(appId);
    if (res.state === 200) {
      ElMessage.success(res.message);
    } else {
      ElMessage.error(res.message);
    }
    proTable.value?.getTableList();
  });
};
</script>
