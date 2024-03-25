<template>
  <div class="card filter">
    <h4 v-if="title" class="title sle">
      {{ title }}
    </h4>
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
    <el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
      <el-tree ref="treeRef" :load="loadNode" :lazy="lazy" :default-expand-all="defaultExpandAll" :default-expanded-keys="defaultExpandedKeys && defaultExpandedKeys.length > 0 ? defaultExpandedKeys : initDefaultExpandedKeys" :node-key="id" :data="multiple ? treeData : treeAllData" :show-checkbox="multiple" :check-strictly="checkStrictly" :current-node-key="!multiple ? selected : ''" :highlight-current="!multiple" :expand-on-click-node="false" :check-on-click-node="multiple" :props="defaultProps" :filter-node-method="filterNode" :default-checked-keys="multiple ? selected : []" @node-click="handleNodeClick" @check="handleCheckChange">
        <template #default="scope">
          <span class="el-tree-node__label">
            <slot :row="scope">
              {{ scope.node.label }}
            </slot>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="TreeFilter">
import { ref, watch, onBeforeMount, nextTick } from "vue";
import type Node from "element-plus/es/components/tree/src/model/node";
import { ElTree } from "element-plus";
import { ElMessage } from "element-plus";

// 接收父组件参数并设置默认值
interface TreeFilterProps {
  requestApi?: (data?: any) => Promise<any>; // 请求分类数据的 api ==> 非必传
  data?: { [key: string]: any }[]; // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
  title?: string; // treeFilter 标题 ==> 非必传
  id?: string; // 选择的id ==> 非必传，默认为 “id”
  label?: string; // 显示的label ==> 非必传，默认为 “label”
  multiple?: boolean; // 是否为多选 ==> 非必传，默认为 false
  multipleHalfChecked?: boolean; // 多选时，办选中的节点数据是否返回
  defaultValue?: any; // 默认选中的值 ==> 非必传
  defaultExpandAll?: boolean; // 是否展开全部 默认false
  defaultExpandedKeys?: string[]; // 需要展开的节点数组
  lazy?: boolean; //是否使用异步
  rootName?: string; // 根节点的名称
  rootId?: string; //根节点ID
  checkStrictly?: boolean; // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
}
const props = withDefaults(defineProps<TreeFilterProps>(), {
  id: "id",
  label: "label",
  multiple: false,
  defaultExpandAll: false,
  multipleHalfChecked: false,
  lazy: false,
  rootName: "根节点",
  rootId: "root",
  checkStrictly: false
});

const defaultProps = {
  children: "children",
  label: props.label
};

const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref<{ [key: string]: any }[]>([]);
const treeAllData = ref<{ [key: string]: any }[]>([]);
const initDefaultExpandedKeys = ref<string[]>([]);
const initDefaultValue = ref<string>("");
const selected = ref();
const setSelected = () => {
  if (props.multiple) {
    selected.value = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
  } else {
    selected.value = typeof props.defaultValue === "string" ? (props.defaultValue ? props.defaultValue : initDefaultValue.value) : initDefaultValue.value;
  }
};

onBeforeMount(async () => {
  setSelected();
  if (props.requestApi && props.lazy === false) {
    const { data } = await props.requestApi!();
    treeData.value = data;
    treeAllData.value = [...data];
  }
});
interface Tree {
  [key: string]: any;
}

/**
 * 异步加载树节点的方法
 * @param node 可指定树节点的根节点ID，默认root
 * @param resolve 树的子节点的结合
 */

const loadNode = async (node: Node, resolve: (data: Tree[]) => any) => {
  const { data, state, message } = await props.requestApi!({ parentId: node.level === 0 ? props.rootId : node.data.id });
  if (state === 200) {
    if (node.level === 0) {
      initDefaultExpandedKeys.value = data.map((item: { id: any }) => item.id);
      initDefaultValue.value = data[0].id;
      emit("selectDefaultEvent", data[0]);
      setSelected();
    }
    return resolve(data);
  } else {
    ElMessage.error({ message: message });
  }
};

// 使用 nextTick 防止打包后赋值不生效，开发环境是正常的
watch(
  () => props.defaultValue,
  () => nextTick(() => setSelected()),
  { deep: true, immediate: true }
);

watch(
  () => props.data,
  () => {
    if (props.data?.length) {
      treeData.value = props.data;
      treeAllData.value = [...props.data];
    }
  },
  { deep: true, immediate: true }
);

const filterText = ref("");
watch(filterText, val => {
  treeRef.value!.filter(val);
});

// 过滤
const filterNode = (value: string, data: { [key: string]: any }, node: any) => {
  if (!value) return true;
  let parentNode = node.parent,
    labels = [node.label],
    level = 1;
  while (level < node.level) {
    labels = [...labels, parentNode.label];
    parentNode = parentNode.parent;
    level++;
  }
  return labels.some(label => label.indexOf(value) !== -1);
};

// emit
const emit = defineEmits<{
  change: [value: any];
  changeSelect: [value: any];
  selectDefaultEvent: [value: any];
}>();

// 单选
const handleNodeClick = (data: { [key: string]: any }) => {
  if (props.multiple) return;
  emit("change", data);
};

// 多选
const handleCheckChange = () => {
  let checkKeys: any = treeRef.value?.getCheckedKeys();
  if (props.multipleHalfChecked) {
    emit("change", checkKeys.concat(treeRef.value?.getHalfCheckedKeys()));
    emit("changeSelect", treeRef.value?.getCheckedNodes());
  } else {
    emit("change", checkKeys);
    emit("changeSelect", treeRef.value?.getCheckedNodes());
  }
};

// 暴露给父组件使用
defineExpose({ treeData, treeAllData, initDefaultValue, treeRef });
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
