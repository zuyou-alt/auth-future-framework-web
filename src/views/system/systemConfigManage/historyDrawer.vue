<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}接口`">
    <el-timeline style="padding-left: 0">
      <el-timeline-item v-for="item in configHistoryList" :key="item.id" :color="item.publishStatus === 1 ? '#0bbd87' : '#e4e7ed'" size="large" placement="top" :timestamp="item.updateTime ? item.updateTime : item.createTime">
        <el-card class="box-card">
          <div class="config_version_class" v-if="item.currentFlag" style="color: #0bbd87">正在使用中</div>
          <div class="config_version_class">配置版本：{{ item.version }}</div>
          <div class="config_version_class">配置内容：{{ item.configContent }}</div>
          <div v-if="!item.currentFlag" style="display: flex; justify-content: flex-end">
            <el-button type="danger" link :icon="Delete" @click="deleteHistoryConfig(item.versionId!)">删除</el-button>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-drawer>
</template>

<script setup lang="ts" name="SystemConfigDrawer">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { SystemConfig } from "@/api/interface/systemConfig";
import { getConfigHistoryVersionApi, removeHisVersionApi } from "@/api/modules/systemConfigApi";
import { Delete } from "@element-plus/icons-vue";
interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<SystemConfig.ConfigInfo>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const configHistoryList = ref<SystemConfig.ConfigInfo[]>([]);
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  let { state, data, message } = await getConfigHistoryVersionApi(params.row.id!);
  if (state === 200) {
    configHistoryList.value = data;
  } else {
    ElMessage.error(message);
  }
};

/**
 * 点击删除配置
 * @param configId 配置ID
 */
const deleteHistoryConfig = (configId: string) => {
  ElMessageBox.confirm(`是否确认删除该版本配置?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    const res = await removeHisVersionApi(configId);
    if (res.state === 200) {
      ElMessage({ type: "success", message: `删除成功!` });
      let { state, data, message } = await getConfigHistoryVersionApi(drawerProps.value.row.id!);
      if (state === 200) {
        configHistoryList.value = data;
      } else {
        ElMessage.error(message);
      }
    } else {
      ElMessage({ type: "warning", message: res.message });
    }
  });
};

defineExpose({
  acceptParams
});
</script>
<style scoped lang="scss">
.config_version_class {
  margin-bottom: 5px;
}
</style>
