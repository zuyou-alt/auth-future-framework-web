<!-- 即时通讯主页 -->
<template>
  <div class="main-box">
    <div class="im_main_class">
      <el-row>
        <el-col :span="2" class="im_main_comm_class left_class">
          <LeftNevigation></LeftNevigation>
        </el-col>
        <el-col :span="8" class="im_main_comm_class list_class">
          <ChatListRegion></ChatListRegion>
        </el-col>
        <el-col :span="14" class="im_main_comm_class chat_class">
          <ChatRegion></ChatRegion>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LeftNevigation from "./leftNavigation.vue";
import ChatListRegion from "./chatListRegion.vue";
import ChatRegion from "./chatRegion.vue";
</script>
<style lang="scss" scoped>
.main-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.im_main_class {
  width: 50%;
  height: 75%;
  border: 1px solid #b2b0b0;
}
.left_class {
  background-color: #2e2e2e;
}
.list_class {
  background-color: #e6e5e5;
}
.chat_class {
  background-color: #f5f5f5;
  border-left: 1px solid #b2b0b0;
}
</style>
