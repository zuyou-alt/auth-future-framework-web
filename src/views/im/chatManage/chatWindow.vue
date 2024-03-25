<!--  -->
<template>
  <div class="">
    <el-scrollbar ref="chatLogScrollbarRef" :height="chatHeight">
      <div ref="innerRef" style="margin-right: 20px; margin-left: 20px">
        <div v-for="(item, index) in chatData" :key="index">
          <div v-if="item.type === 2" style="display: flex; margin-top: 15px; direction: ltr">
            <el-image style="width: 35px; height: 35px; cursor: pointer" :src="url" />
            <div class="chat_log_content_left_class">
              <div v-if="false">lksdnfl</div>
              <el-card :body-style="cardStyle">{{ item.content }}</el-card>
            </div>
          </div>
          <div v-if="item.type === 1" style="display: flex; margin-top: 15px; direction: rtl">
            <el-image style="width: 35px; height: 35px; cursor: pointer" :src="url" />
            <div class="chat_log_content_right_class">
              <div v-if="false">lksdnfl</div>
              <el-card :body-style="cardStyle">{{ item.content }}</el-card>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <div class="chat_input_class">
      <div style="padding-top: 6px">
        <i class="icon-authbiaoqing_xiao chat_region_icon_class" style="font-size: 26px"></i>
        <el-icon class="chat_region_icon_class"><FolderOpened /></el-icon>
        <el-icon class="chat_region_icon_class"><ChatDotRound /></el-icon>
      </div>
      <div>
        <el-input ref="chatInputContentRef" v-model="inputContent" maxlength="1000" type="textarea" :rows="2" resize="none" />
      </div>
      <div style="direction: rtl">
        <el-button class="input_button_class" type="info" plain @click="sendMssage">发送(S)</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";

const url = "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
const chatHeight = ref(window.innerHeight - 560); // 滚动条的高度定义
const inputContent = ref<string>("");
const chatData = ref([
  { id: 1, name: "asdas", type: 1, content: "咱们第7期新班今晚开班~1年中报名学习最好的时机！最后两个最大6000秒杀券， 并享SVIP终身学习权限，12期免息+大型抽奖（学费免单，华为折叠手机，大疆无人机，4k高清曲面显示器+人体工学椅+小米手环！不参加可以和小十我申请折现！！今晚8点诸葛老师就开班了，速速回复小十“咨询”了解详情哦~" },
  { id: 1, name: "asdas", type: 1, content: "我是一条测试消息" },
  { id: 1, name: "asdas", type: 2, content: "我是一条测试消息" },
  { id: 1, name: "asdas", type: 1, content: "我是一条测试消息" },
  { id: 1, name: "asdas", type: 2, content: "我是一条我是一条测试消息我是一条测试消息测试消息" },
  { id: 1, name: "asdas", type: 2, content: "我是一条测试消息" },
  { id: 1, name: "asdas", type: 1, content: "我是一条测试消息" },
  { id: 1, name: "asdas", type: 1, content: "我是一条测我是一条测试消息我是一条测试消息试消息" },
  { id: 1, name: "asdas", type: 1, content: "我是一条我是一条测试消息我是一条测试消息测试消息" },
  { id: 1, name: "asdas", type: 2, content: "我是一条测试消息" },
  { id: 1, name: "asdas", type: 1, content: "我是一条测试消息" },
  { id: 1, name: "asdas", type: 2, content: "我是一条我是一条测试消息我是一条测试消息我是一条测试消息我是一条测试消息测试消息" },
  { id: 1, name: "asdas", type: 2, content: "我是一条我是一条测试消息我是一条测试消息测试消息" },
  { id: 1, name: "asdas", type: 1, content: "我是一条测试消息" }
]);

onMounted(() => {
  customFocus(); //自动聚焦
  setScrollbarBottom(); // 初始化滚动条
});

/**
 * 自动聚焦输入框
 */
const chatInputContentRef = ref<InstanceType<typeof HTMLInputElement> | null>(null);
const customFocus = () => {
  nextTick().then(() => chatInputContentRef.value!.focus());
};

/**
 * 页面加载完成后将滚动条置底
 */
const innerRef = ref<HTMLDivElement>();
import { ElScrollbar as ElScrollbarType } from "element-plus";
const chatLogScrollbarRef = ref<InstanceType<typeof ElScrollbarType> | null>(null);
const setScrollbarBottom = async () => {
  await nextTick();
  if (innerRef.value!.clientHeight > chatHeight.value) {
    chatLogScrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight);
  }
};

const sendMssage = () => {
  chatData.value.push({ id: 1, name: "asdas", type: 1, content: "我是一条测试消息" });
  setScrollbarBottom();
};

/**
 * 聊天记录内容card
 */
const cardStyle = ref({
  padding: "3px",
  maxWidth: "300px"
});
</script>
<style lang="scss" scoped>
.chat_input_class {
  height: 100%;
  margin-top: 10px;
  border-top: 1px solid #b2b0b0;
}
.triangle_left {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-right: 8px solid white;
  border-bottom: 5px solid transparent;
}
.triangle_rigth {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid white;
}
:deep(.el-textarea__inner) {
  padding: 0 15px;
  color: black;
  background-color: #f5f5f5;
  box-shadow: 0 0 0 0;
}
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 0;
}
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 0;
}
.input_button_class {
  width: 18%;
  margin-top: 8px;
  margin-right: 20px;
  color: #07c160;
  background-color: #e9e9e9;
  border: 0;
}
.chat_region_icon_class {
  margin-left: 10px;
  font-size: 20px;
}
.chat_log_content_left_class {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: flex-start;
  justify-content: center;
  margin-left: 10px;
}
.chat_log_content_right_class {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-right: 10px;
}
</style>
