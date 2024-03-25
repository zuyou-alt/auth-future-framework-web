<!-- 用户身份变更 -->
<template>
  <el-dialog v-model="dialogVisible" :title="title" width="500px" draggable :close-on-click-modal="false">
    <el-checkbox-group v-model="userIdentityList">
      <el-checkbox v-for="item in userIdentityEnum" :key="item.value" :label="item.value">{{ item.label! }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUserIdentity">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { User } from "@/api/interface";
import { updateUserIdentityApi } from "@/api/modules/user";
import { ElMessage } from "element-plus";
// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
const dialogVisible = ref(false);
const identityUser = ref<User.UserInfo>({});
let userIdentityEnum = ref<Dict.DictData[]>([]);
const title = ref<string>("");
let userIdentityList = ref<string[]>([]);

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.UserInfo>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  identityUser.value = params.row;
  dialogVisible.value = true;
  userIdentityList.value = params.row.identityList!;
  title.value = "您正在变更用户【" + identityUser.value.name + "】的身份";
  let { data } = await getBatchDict(["user_identity"]);
  userIdentityEnum.value = data.filter(item => item.dictType === "user_identity")[0].dictDataCommonList;
};

const saveUserIdentity = async () => {
  let { state, data, message } = await updateUserIdentityApi({ userId: identityUser.value.id!, identityList: userIdentityList.value });
  if (state === 200 && data) {
    ElMessage.success(message);
    dialogVisible.value = false;
    drawerProps.value.getTableList!();
  } else {
    ElMessage.error(message);
  }
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped></style>
