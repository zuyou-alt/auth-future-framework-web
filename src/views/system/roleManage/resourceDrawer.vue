<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}资源`">
    <TreeFilter style="width: 410px; height: calc(100% - 60px)" label="menuTitle" :multiple-half-checked="true" title="选择菜单(多选)" multiple :default-value="defaultValue" :data="treeAllData" :default-expanded-keys="defaultExpandedKeys" :default-expand-all="false" @change="leftTreeHandleNodeClick" />
    <div style="display: flex; justify-content: center; margin-top: 10px">
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="ResourceDrawer">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Role } from "@/api/interface/roleInfo";
import { queryMenuAllListTreeApi } from "@/api/modules/menuApi";
import { Menu } from "@/api/interface/menu";
import TreeFilter from "@/components/TreeFilter/index.vue";
// 存储菜单树数据
const treeAllData = ref<Menu.MenuInfo[]>([]);
// 存储需要选中的值
const defaultValue = ref<string[]>([]);
// 存储默认展开的值
const defaultExpandedKeys = ref<string[]>([]);
// 选择标识（如果没有修改，则无需提交） 默认为false
const editFlag = ref<boolean>(false);
// 存储选中的值的ID
const selectIds = ref<any>([]);
onMounted(async () => {
  // 初始化获取菜单信息
  const { data } = await queryMenuAllListTreeApi();
  data.forEach(menu => {
    //默认展开系统级别的菜单
    if (menu.menuType === "system") {
      defaultExpandedKeys.value.push(menu.id!);
    }
  });
  treeAllData.value = [...data];
});

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
  defaultValue.value = params.row.menuIdList!;
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
    bindType: 4
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
