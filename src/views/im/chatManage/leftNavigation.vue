<!-- 左侧导航栏 -->
<template>
  <div class="left_nav_main_class">
    <div class="user_avatar_div_class">
      <el-image style="width: 35px; height: 35px; cursor: pointer" :src="url" fit="fill" />
    </div>
    <div class="chat_icon_class">
      <el-icon size="25" style="color: white; cursor: pointer"><ChatSquare /></el-icon>
    </div>
    <div class="chat_icon_class">
      <el-icon size="25" style="color: white; cursor: pointer"><User /></el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
const url = "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
</script>
<style lang="scss" scoped>
.left_nav_main_class {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.user_avatar_div_class {
  margin-top: 35px;
}
.chat_icon_class {
  margin-top: 20px;
}
</style>
