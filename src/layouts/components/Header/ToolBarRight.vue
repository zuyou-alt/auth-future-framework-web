<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <AssemblySize id="assemblySize" />
      <Language id="language" />
      <SearchMenu id="searchMenu" />
      <ThemeSetting id="themeSetting" />
      <Message id="message" ref="message_ref" />
      <Fullscreen id="fullscreen" />
    </div>

    <!-- 用户多组织 -->
    <el-dropdown trigger="click" style="margin-right: 20px; margin-left: 20px">
      <span style="font-size: 15px; color: var(--el-header-text-color)">
        {{ currentOrgName }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in userOrgData" :key="item.id" @click="clickOrgHandler(item)">{{ item.orgName + "（" + item.typeStr! + "）" }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span class="username">{{ userInfoData.userName }}</span>
    <Avatar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { UserOrg, UserInfo } from "@/stores/interface";
import AssemblySize from "./components/AssemblySize.vue";
import Language from "./components/Language.vue";
import SearchMenu from "./components/SearchMenu.vue";
import ThemeSetting from "./components/ThemeSetting.vue";
import Message from "./components/Message.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";
import { switchOrgApi } from "@/api/modules/login";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { ElNotification, ElMessage } from "element-plus";
import { getTimeState } from "@/utils";
import { connectWebSocket, onWebSocket } from "@/hooks/useWebSocket";
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
// 显示用户多组织信息
const userInfoData = ref<UserInfo>({});
const userOrgData = ref<UserOrg[]>([]);
// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let userOrgTypeEnum = ref<Dict.DictData[]>([]);
const currentOrgName = ref<string>("");
const currentUserOrgType = ref<number>(0);
onMounted(async () => {
  let { data } = await getBatchDict(["user_org_type"]);
  userOrgTypeEnum.value = data.filter(item => item.dictType === "user_org_type")[0].dictDataCommonList;
  await setTitle();
  connectWebSocket("ws://127.0.0.1:8907?userId=" + userStore.userInfo.userId);
  onWebSocket(onSocketReceiveMsg);
});

// 获取树形实例
const message_ref = ref<InstanceType<typeof Message> | null>(null);
const onSocketReceiveMsg = (data: object) => {
  message_ref.value!.messageHandler(data);
};

const setTitle = () => {
  userInfoData.value = userStore.userInfo;
  userOrgData.value = userStore.userInfo.userOrgVoList!;
  userOrgData.value.forEach(o => {
    o.typeStr = getOrgTypeStr(o.type!);
  });
  currentUserOrgType.value = getOrgType()!;
  currentOrgName.value = userInfoData.value.orgName! + "（" + getOrgTypeStr(currentUserOrgType.value!) + "）";
};
// 获取当前组织的用户关系
const getOrgType = () => {
  let currentOrg = userOrgData.value.filter(o => o.orgId === userInfoData.value.orgId);
  return currentOrg ? currentOrg[0].type : undefined;
};

// 根据组织用户关系类型获取中文名称
const getOrgTypeStr = (type: number) => {
  let result = userOrgTypeEnum.value.filter(o => o.value === type + "");
  return result ? result[0].label : "";
};

const clickOrgHandler = async (userOrg: UserOrg) => {
  const { data, state, message } = await switchOrgApi(userOrg.orgId!);
  if (state === 200) {
    userStore.setToken(data.accessToken);
    userStore.setUserInfo(data.loginUser as UserInfo);
    // 2.添加动态路由
    await initDynamicRouter();
    // 3.清空 tabs、keepAlive 数据
    tabsStore.setTabs([]);
    keepAliveStore.setKeepAliveName([]);
    // 4.跳转到首页
    router.push(HOME_URL);
    setTitle();
    ElNotification({
      title: getTimeState(),
      message: "组织切换成功！",
      type: "success",
      duration: 3000
    });
  } else {
    ElMessage.error(message);
  }
};
</script>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>
