<!-- 节点基础信息展示 -->
<template>
  <div class="node_base_info_class">
    <el-form ref="node_base_info_ref" label-width="80px" label-suffix=" :" :model="baseInfoPropes.info">
      <el-form-item label="节点名称" prop="nodeName">
        <el-input v-model="baseInfoPropes.info.nodeName" placeholder="请填写节点名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="节点标识" prop="nodeId">
        <el-input v-model="baseInfoPropes.info.nodeId" disabled placeholder="请填写节点标识" clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts" name="NodeBaseInfo">
import { ref } from "vue";
import { BpmnNode } from "@/api/interface/bpmn/Node";
/**
 * 定义接收的参数接口
 */
interface BaseInfoPropes {
  info: Partial<BpmnNode.BpmnNodeInfo>;
}

/**
 * 定义接参数对象
 */
const baseInfoPropes = ref<BaseInfoPropes>({
  info: {}
});

/**
 * 定义传递参数的方法 父组件直接调用即可
 * @param params 参数
 */
const acceptParams = async (params: BaseInfoPropes) => {
  baseInfoPropes.value.info = params.info;
};

/**
 * 将该方法暴露出去
 */
defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
.node_base_info_class {
  padding-right: 10px;
}
</style>
