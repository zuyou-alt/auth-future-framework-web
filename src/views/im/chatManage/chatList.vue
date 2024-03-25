<template>
  <div style="padding-top: 10px; padding-left: 12px">
    <el-scrollbar :height="chatListHeight">
      <div class="chat_item_class" v-for="(item, index) in 10" :key="index" @click="clickUserChatHandler(item, index)" :class="{ selected: index === currentIndex }">
        <div>
          <el-image style="width: 40px; height: 40px" :src="url" fit="fill" />
        </div>
        <div class="chat_item_child_class">
          <el-row class="row-bg" justify="space-between">
            <el-col :span="16">
              <div>测试用户</div>
            </el-col>
            <el-col :span="8">
              <div style="font-size: 12px">2024-01-34</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span style="font-size: 12px; color: #999999"> 我是一条用户消息 </span>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const url = "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
const chatListHeight = ref(window.innerHeight - 420); // 滚动条的高度定义
const currentIndex = ref<any>("");
const clickUserChatHandler = (item, index) => {
  currentIndex.value = index;
};
</script>
<style lang="scss" scoped>
.chat_item_class {
  display: flex;
  align-items: center;
  width: auto;
  height: 60px;
  cursor: pointer;
}
.chat_item_class:hover {
  background-color: #dddbda;
}
.chat_item_child_class {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 52px;
  margin-left: 10px;
}
.selected {
  background-color: #cac8c7 !important;
}
</style>
