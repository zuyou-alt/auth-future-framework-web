<!--  -->
<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="500px" :title="`${drawerProps.title}`">
    <TreeFilter ref="org_tree_ref" style="width: 100%; height: calc(100% - 300px); margin-right: 0" label="name" title="选择组织(多选)" :check-strictly="true" multiple :default-value="defaultValue" :lazy="true" :request-api="getOrgListByParentIdApi" :default-expanded-keys="defaultExpandedKeys" :default-expand-all="false" @change-select="leftTreeHandleNodeClick" />
    <div class="card table-main" style="width: 100%; margin-top: 8px">
      <el-table :data="userOrgDataList" :border="true" style="width: 100%" height="250px">
        <el-table-column prop="orgName" label="组织名称" />
        <el-table-column prop="type" align="center" label="组织关系" width="120">
          <template #default="scope">
            <el-select v-model="scope.row.type">
              <el-option v-for="item in userOrgTypeEnum" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="operation" align="center" label="操作" width="80">
          <template #default="scope">
            <el-button type="primary" link :icon="Delete" @click="deleteUserOrg(scope.row)">删除</el-button>
            <!-- <el-button type="success" link :icon="EditPen" @click="saveUserOrg(scope.row)">保存</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-drawer>
</template>
<script lang="tsx" setup>
import { ref } from "vue";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { queryUserOrgListApi, saveUserOrgApi, removeUserOrgApi } from "@/api/modules/user";
import { Delete } from "@element-plus/icons-vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { ElMessage } from "element-plus";
import { getOrgListByParentIdApi } from "@/api/modules/orgApi";
import { Org } from "@/api/interface/org";
import type Node from "element-plus/es/components/tree/src/model/node";

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.UserInfo>;
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
const userOrgDataList = ref<User.UserOrgRelation[]>([]);
const reUserOrgDataList = ref<User.UserOrgRelation[]>([]);
// 存储需要选中的值
const defaultValue = ref<string[]>([]);
// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let userOrgTypeEnum = ref<Dict.DictData[]>([]);
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  getUserOrgDataList();
  let { data } = await getBatchDict(["user_org_type"]);
  userOrgTypeEnum.value = data.filter(item => item.dictType === "user_org_type")[0].dictDataCommonList;
  userOrgTypeEnum.value.forEach(item => (item.value = parseInt(item.value!)));
};

const getUserOrgDataList = async () => {
  defaultValue.value = [];
  defaultValue.value.push(drawerProps.value.row.relevancyOrgId!);
  let { data: userOrgData } = await queryUserOrgListApi({ userId: drawerProps.value.row.id });
  userOrgDataList.value = userOrgData;
  reUserOrgDataList.value = userOrgData;
  userOrgData.forEach(item => defaultValue.value.push(item.orgId));
  drawerVisible.value = true;
};

defineExpose({
  acceptParams
});

// 存储默认展开的值
const defaultExpandedKeys = ref<string[]>([]);

/**
 * 选择树节点的回调
 * @param node
 */
const leftTreeHandleNodeClick = async (node: Org.OrgInfo[]) => {
  let currentSelectData = ref<User.UserOrgRelation[]>([]);
  // 后台返回的组织和当前选择的需要做结合显示
  node.forEach(item => {
    let no: User.UserOrgRelation = {
      orgId: item.id,
      orgName: item.name,
      userId: drawerProps.value.row.id,
      type: getType(item.id, drawerProps.value.row.id!)
    };
    currentSelectData.value.push(no);
  });
  userOrgDataList.value = [];
  userOrgDataList.value = currentSelectData.value;
};

/**
 * 获取原来存储的初始组织关系值
 * @param orgId  组织ID
 * @param userId  用户ID
 */
const getType = (orgId: string, userId: string): number => {
  let result = reUserOrgDataList.value.filter(item => item.orgId === orgId && item.userId === userId);
  console.log("筛选结果", result);
  return result.length > 0 ? result[0].type : undefined!;
};

// 获取树形实例
const org_tree_ref = ref<InstanceType<typeof TreeFilter>>();
// 删除组织关系
const deleteUserOrg = async (row: User.UserOrgRelation) => {
  await useHandleData(removeUserOrgApi, { userId: row.userId, orgId: row.orgId }, `删除组织关系`);
  getUserOrgDataList();
  // 设置目前选中的节点: 获取当前选中的节点，排除删除的节点，重新选中
  let selectData = org_tree_ref.value!.treeRef!.getCheckedNodes();
  let newSelectData = selectData?.filter(item => item.id !== row.orgId);
  org_tree_ref.value!.treeRef!.setCheckedNodes(newSelectData as Node[]);
};

// 批量保存组织关系
const handleSubmit = async () => {
  let orgInfo: User.UserOrgType[] = [];
  userOrgDataList.value.forEach(item => {
    let type: User.UserOrgType = { orgId: item.orgId, type: item.type };
    orgInfo.push(type);
  });
  let relation: User.SaveUserOrg = {
    userId: drawerProps.value.row.id!,
    orgIds: orgInfo
  };
  await saveUserOrgApi(relation);
  ElMessage.success("保存成功！");
  console.log("保存");
};
</script>
<style lang="scss" scoped></style>
