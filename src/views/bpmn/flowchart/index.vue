<template>
  <div class="designer-container">
    <div id="container" class="containerBox"></div>
    <div id="js-properties-panel" class="panel">
      <div class="custom-properties-panel">
        <RightOptions ref="right_options_ref" @get-xml-data="getXmlData"></RightOptions>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { markRaw, onMounted, ref } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import translate from "@/views/bpmn/custom/translate/translate";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import EventBus from "diagram-js/lib/core/EventBus";
import CustomPalette from "@/views/bpmn/custom/palette/";
import RightOptions from "@/views/bpmn/rightOptions/index.vue";

let customTranslateModule = {
  translate: ["value", translate]
};
const bpmnModeler = ref<any>({});
onMounted(() => {
  bpmnModeler.value = markRaw(
    new BpmnModeler({
      container: "#container",
      // 添加控制板
      propertiesPanel: {
        parent: "#js-properties-panel"
      },
      additionalModules: [customTranslateModule, CustomPalette]
    })
  );
  bpmnModeler.value.createDiagram();
  // 注册事件监听
  registerEventBus();
});

const registerEventBus = () => {
  // 获取bpmn.js的EventBus。通过打印eventBus可以查看支持的所有EventBus： console.log(eventBus);
  const eventBus: EventBus = bpmnModeler.value.get("eventBus");
  console.log("事件列表", eventBus);
  const eventTypes = ["selection.changed", "shape.remove"];
  eventTypes.forEach(eventType => {
    eventBus.on(eventType, (e: any) => {
      console.log("点击的节点信息", e);
      if (eventType === "selection.changed") {
        const { newSelection } = e;
        if (newSelection && newSelection[0] && newSelection[0].type === "bpmn:TextAnnotation") return;
        if (newSelection.length === 0) {
          //取消选中：取消时（点击了画布），右侧显示该任务的总情况
          console.debug("取消选中", newSelection);
        }
        if (newSelection.length === 1) {
          //单独选中节点时： 右侧显示节点的详情
          clickNodeHandler(newSelection[0]);
        }
        if (newSelection.length > 1) {
          // 多选节点：多选时，右侧显示该任务的总情况
          console.debug("多选节点", newSelection);
        }
      }

      if (eventType === "shape.remove") {
        // 删除节点事件
        removeNodeHandler(e);
      }
    });
  });
};

// 获取基础信息部分实例
const right_options_ref = ref<InstanceType<typeof RightOptions> | null>(null);
/**
 * 节点点击事件
 * @param element 电机的节点
 */
const clickNodeHandler = element => {
  let baseParams = { info: { nodeId: element.id, nodeName: "节点名称", nodeType: element.type }, clickNode: true };
  right_options_ref.value?.acceptParams(baseParams);
};

/**
 * 节点点击事件
 * @param element 电机的节点
 */
const removeNodeHandler = element => {
  let baseParams = { info: { nodeId: element.id, nodeName: "节点名称", nodeType: element.type }, removeNode: true };
  right_options_ref.value?.acceptParams(baseParams);
};
/**
 * 获取流程图的XML数据
 * @param callback 设置返回
 */
const getXmlData = (callback: any) => {
  return bpmnModeler.value.saveXML({ format: true }).then(res => {
    return callback(res);
  });
};

// const downloadXml = () => {
//   bpmnModeler.value.saveXML({ format: true }).then(res => {
//     console.log("画出的xml数据为", res);
//   });
// };
// const creteXml = () => {
//   bpmnModeler.value.importXML(``);
// };
</script>

<style lang="scss" scope>
@import "./index.scss";
</style>
