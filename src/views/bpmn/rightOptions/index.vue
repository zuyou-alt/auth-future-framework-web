<!-- 右侧栏 -->
<template>
  <div class="right_options_class">
    <el-tabs v-model="tabActiveName" class="tabs_class" @tab-click="handleClick">
      <el-scrollbar :height="tabHeight">
        <el-tab-pane label="任务详情" name="taskInfoTab"> 任务详情 </el-tab-pane>
        <el-tab-pane label="节点详情" name="nodeInfoTab">
          <el-collapse v-model="collActiveName">
            <el-collapse-item title="基础信息" name="1">
              <BaseInfo ref="base_info_ref"></BaseInfo>
            </el-collapse-item>
            <el-collapse-item title="节点执行器" name="2">
              <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
              <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
            </el-collapse-item>
            <el-collapse-item title="节点属性" name="3">
              <div>Simplify the process: keep operating process simple and intuitive;</div>
              <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;</div>
              <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.</div>
            </el-collapse-item>
            <el-collapse-item title="Controllability" name="4">
              <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
              <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
            </el-collapse-item>
            <el-collapse-item title="Controllability" name="5">
              <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
              <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
            </el-collapse-item>
            <el-collapse-item title="Controllability" name="6">
              <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
              <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-scrollbar>
    </el-tabs>

    <div class="button_class">
      <el-button type="primary" @click="saveTaskHandler">保存任务</el-button>
      <el-button type="primary">保存节点信息</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// 引入基础信息组件
import BaseInfo from "@/views/bpmn/rightOptions/baseInfo.vue";
import { BpmnNode } from "@/api/interface/bpmn/Node";
const collActiveName = ref(["1"]); // 默认展开的模块定义
const tabActiveName = ref("taskInfoTab"); // 默认展开的tab定义
const tabHeight = ref(window.innerHeight - 250); // 滚动条的高度定义

/**
 * 定义接收的参数接口
 */
interface RightOptionProps {
  info: Partial<BpmnNode.BpmnNodeInfo>;
  clickNode?: boolean;
  removeNode?: boolean;
}

/**
 * 定义接参数对象
 */
const rightOptionProps = ref<RightOptionProps>({
  info: {},
  clickNode: false,
  removeNode: false
});

/**
 * 定义传递参数的方法 父组件直接调用即可
 * @param params 参数
 */
const acceptParams = async (params: RightOptionProps) => {
  rightOptionProps.value.info = params.info;
  rightOptionProps.value.clickNode = params.clickNode;
  rightOptionProps.value.removeNode = params.removeNode;
  // 传递基础信息到子组件
  deliverBaseInfo();
  // 修改tab的选中
  handoffTab(params.clickNode!, params.removeNode!);
};
/**
 * 切换tab显示
 * @param clickNode 点击了节点
 * @param removeNode 删除节点
 */
const handoffTab = (clickNode: boolean, removeNode: boolean) => {
  if (removeNode) {
    // 节点删除后，tab也切回任务详情
    tabActiveName.value = "taskInfoTab";
  }

  if (clickNode) {
    // 选中节点时，切换到节点详情页
    tabActiveName.value = "nodeInfoTab";
  }
};
/**
 * 保存任务信息
 */
const emits = defineEmits<{ (event: "getXmlData", data: object): void }>();
const saveTaskHandler = () => {
  // 调用父组件的方法获取流程图的XML，然后进行处理。注意，这里不能在emits的外面处理数据，会有延迟
  emits("getXmlData", data => otherHalder(data));
};

const otherHalder = xmlData => {
  // alert(xmlData.xml);
  console.log("子组件获取到的xml数据", xmlData);
};

/**
 * 将该方法暴露出去
 */
defineExpose({
  acceptParams
});

// 获取基础信息组件实例
const base_info_ref = ref<InstanceType<typeof BaseInfo> | null>(null);

/**
 * 传递基础信息到子组件
 */
const deliverBaseInfo = () => {
  base_info_ref.value?.acceptParams({ info: rightOptionProps.value.info });
};

/**
 * tab标签页切换事件
 */
import type { TabsPaneContext } from "element-plus";
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.debug(tab, event);
};
</script>
<style lang="scss" scoped>
:deep(.el-collapse-item__header) {
  font-size: 17px;
  line-height: 17px;
  color: var(--el-text-color-primary) !important;
}
.button_class {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
</style>
