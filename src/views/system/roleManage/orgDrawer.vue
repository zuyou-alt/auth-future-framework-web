<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}`">
    <TreeFilter style="width: 410px; height: calc(100% - 60px)" label="name" title="选择组织(多选)" multiple :default-value="defaultValue" :lazy="true" :request-api="getOrgListByParentIdApi" :default-expanded-keys="defaultExpandedKeys" :default-expand-all="false" @change="leftTreeHandleNodeClick" />
    <div style="display: flex; justify-content: center; margin-top: 10px">
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="orgDrawer">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { getOrgListByParentIdApi } from "@/api/modules/orgApi";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { Role } from "@/api/interface/roleInfo";
// 存储需要选中的值
const defaultValue = ref<string[]>([]);
// 存储默认展开的值
const defaultExpandedKeys = ref<string[]>([]);
// 选择标识（如果没有修改，则无需提交） 默认为false
const editFlag = ref<boolean>(false);
// 存储选中的值的ID
const selectIds = ref<any>([]);

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

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  defaultValue.value = params.row.orgList!;
  drawerVisible.value = true;
  editFlag.value = false;
};

// 提交数据（新增/编辑）
const handleSubmit = async () => {
  if (!editFlag.value) {
    ElMessage.warning({ message: "数据未变动！" });
    return;
  }
  let params = {
    roleIds: [drawerProps.value.row.id],
    bindIds: selectIds.value,
    bindType: 2
  };
  await drawerProps.value.api!(params);
  ElMessage.success({ message: `${drawerProps.value.title}成功！` });
  drawerVisible.value = false;
};
/**
 * 点击左侧树节点的回调
 * @param node
 */
const leftTreeHandleNodeClick = async (node: { [key: string]: any }) => {
  editFlag.value = true;
  selectIds.value = node;
};

defineExpose({
  acceptParams
});
</script>
<style scoped lang="scss"></style>
