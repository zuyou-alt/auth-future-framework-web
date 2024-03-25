<!-- 聊天部分 -->
<template>
  <div class="chat_region_class">
    <div class="chat_title_class">
      <div style="font-size: 20px; cursor: pointer">
        <span>测试用户</span>
      </div>
      <div style="font-size: 26px; cursor: pointer">
        <span>...</span>
      </div>
    </div>
    <div class="chat_content_class">
      <ChatWodow></ChatWodow>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ChatWodow from "./chatWindow.vue";
</script>
<style lang="scss" scoped>
.chat_region_class {
  width: 100%;
}
.chat_title_class {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding-right: 10px;
  padding-left: 10px;
  border-bottom: 1px solid #b2b0b0;
}
</style>
