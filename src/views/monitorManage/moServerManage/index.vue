<template>
  <div class="main-box">
    <TreeFilter label="name" title="项目应用管理" :data="projectAppTreeData" :default-expanded-keys="defaultExpandedKeys" :default-value="defaulAppId" @change="changeTreeFilter" />
    <div class="table-box">
      <ProTable ref="proTable" row-key="id" :indent="20" :columns="columns" :request-auto="false" :request-api="pageServerInfoListApi" :init-param="pageServerListParams" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button :disabled="addButtonDisabled" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增服务器</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="EditPen" @click="connectServer(scope.row.id)">测试连接</el-button>
          <el-button type="primary" link :icon="Delete" @click="deletRole(scope.row.id)">删除</el-button>
        </template>
      </ProTable>
      <ServerInfoDrawer ref="drawerRef" />
    </div>
  </div>
</template>
<script setup lang="ts" name="useTreeFilter">
import { ref, reactive, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
// 左侧树相关
import { Project } from "@/api/interface/monitor/project";
import { queryMoProjectAppTreeListApi } from "@/api/modules/monitor/projectApi";
import TreeFilter from "@/components/TreeFilter/index.vue";
// 列表相关
import ProTable from "@/components/ProTable/index.vue";
import { pageServerInfoListApi, saveServerInfoApi, removeServerInfoApi, connectServerApi } from "@/api/modules/monitor/serverApi";
import { Server } from "@/api/interface/monitor/server";
import ServerInfoDrawer from "./serverInfoDrawer.vue";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
// 获取 ProTable 实例
const proTable = ref<ProTableInstance>();
const defaulAppId = ref<string>("");
const projectAppTreeData = ref<Project.MoProjectAppTree[]>();
const currentNode = reactive<Server.ServerInfo>({});

// 初始化列表查询参数
const pageServerListParams = reactive<Server.ServerInfo>({});
let defaultExpandedKeys = ref<string[]>([]);
onBeforeMount(async () => {
  const { data } = await queryMoProjectAppTreeListApi(undefined);
  projectAppTreeData.value = [...data];
  defaultExpandedKeys.value = projectAppTreeData.value.map(item => (item.type === "project" ? item.id : ""));
  defaulAppId.value = projectAppTreeData?.value[0]?.id;
  pageServerListParams.projectId = projectAppTreeData?.value[0]?.id;
  currentNode.appName = projectAppTreeData?.value[0]?.name;
});

/**
 * 点击左侧树回调
 * @param node 属性节点对象
 */
const addButtonDisabled = ref<boolean>(true);
const changeTreeFilter = (node: { [key: string]: any }) => {
  proTable.value!.pageable.pageNum = 1;
  currentNode.appName = node.appName;
  addButtonDisabled.value = node.type === "app" ? false : true;
  if (node.type === "app") {
    pageServerListParams.appId = node.id;
    pageServerListParams.appName = node.name;
    pageServerListParams.projectId = node.projectId;
  }
  if (node.type === "project") {
    pageServerListParams.projectId = node.id;
  }
};

// 表格配置项
const columns = reactive<ColumnProps<Server.ServerInfo>[]>([
  { type: "index", label: "序号", width: 80 },
  { prop: "serverName", label: "服务器名称", align: "left", search: { el: "input", props: { placeholder: "请输入服务器名称查询" } } },
  { prop: "serverIp", label: "服务器IP", align: "left", search: { el: "input", props: { placeholder: "请输入服务器IP查询" } } },
  { prop: "serverPort", label: "服务器端口" },
  { prop: "userName", label: "账号", align: "left" },
  { prop: "appName", label: "应用名称", align: "left" },
  { prop: "projectName", label: "项目名称", align: "left" },
  { prop: "createTime", label: "创建时间", align: "left" },
  { prop: "operation", label: "操作", width: 250 }
]);

const deletRole = async (roleId: string) => {
  ElMessageBox.confirm(`是否确认删除该服务器?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    let res = await removeServerInfoApi(roleId);
    if (res.state === 200) {
      ElMessage.success(res.message);
    } else {
      ElMessage.error(res.message);
    }
    proTable.value?.getTableList();
  });
};

const connectServer = async (id: string) => {
  let res = await connectServerApi(id);
  if (res.state === 200 && res.data === true) {
    ElMessage.success(res.message);
  } else {
    ElMessage.error("连接失败");
  }
};

/**
 * 打开角色添加和编辑界面
 */
const drawerRef = ref<InstanceType<typeof ServerInfoDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Server.ServerInfo> = {}) => {
  if (!pageServerListParams.appId && "新增" === title) {
    ElMessage.warning("请先选择接口所属应用！");
    return;
  }
  if ("新增" === title) {
    row.projectId = pageServerListParams.projectId;
    row.appId = pageServerListParams.appId;
    row.appName = pageServerListParams.appName;
  }
  const params = { title, row: { ...row }, isView: title === "查看", api: title === "新增" ? saveServerInfoApi : title === "编辑" ? saveServerInfoApi : undefined, getTableList: proTable.value?.getTableList };
  drawerRef.value?.acceptParams(params);
};
</script>
