<!-- 中间聊天列表区域 -->
<template>
  <div class="">
    <div class="search_class">
      <div class="search_content_div_class">
        <el-input v-model="searchText" size="small" placeholder="搜索" :prefix-icon="Search" />
        <el-icon style="margin-left: 5px"><Plus /></el-icon>
      </div>
    </div>
    <div>
      <ChatList></ChatList>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import ChatList from "./chatList.vue";
import { Search } from "@element-plus/icons-vue";
const searchText = ref<string>("");
</script>
<style lang="scss" scoped>
.search_class {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 60px;
  background-color: #f7f7f7;
}
.search_content_div_class {
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 10px;
  padding-left: 10px;
  margin-bottom: 12px;
}
</style>
