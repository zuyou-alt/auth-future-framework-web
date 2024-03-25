<template>
  <div class="main-box">
    <TreeFilter ref="treeFilterRef" label="name" title="字典分类" :lazy="true" :request-api="getDictTypeListByParentId" :default-value="defaultValue" :default-expand-all="false" @change="leftTreeHandleNodeClick" />
    <div class="card menu_tree_class">
      <span>字典分类管理</span>
      <el-divider style="margin: 10px 0" />
      <div style="margin: 20px">
        <el-button type="primary" :icon="CirclePlus" @click="addDictType(dictFormRef)">新增分类</el-button>
        <el-button type="danger" :icon="Delete" plain @click="clickRemoveOrg">删除分类</el-button>
      </div>
      <el-form ref="dictFormRef" :model="dictTypeForm" :rules="rules" label-width="90px" style="margin-bottom: 50px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="dictTypeForm.name" placeholder="请输入字典分类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类标识" prop="type">
              <el-input v-model="dictTypeForm.type" placeholder="请输入字典分类标识" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类状态" prop="status">
              <el-radio-group v-model="dictTypeForm.status" placeholder="请选择字典份额里状态">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="2">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类排序" prop="dictSort">
              <el-input v-model="dictTypeForm.dictSort" placeholder="请输入字典分类排序" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="分类说明" prop="remark">
              <el-input v-model="dictTypeForm.remark" placeholder="请输入字典分类描述" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="form_button_class">
          <el-button type="primary" @click="submitForm(dictFormRef)"> 保存分类 </el-button>
          <el-button @click="resetForm(dictFormRef)"> 重置表单 </el-button>
        </el-form-item>
      </el-form>
      <span>字典管理</span>
      <el-divider style="margin: 10px 0" />
      <div style="height: 380px">
        <ProTable ref="proTable" row-key="id" :table-height="'300px'" :pagination="false" :indent="20" :columns="columns" :request-auto="false" :request-api="getDictDataListByDictType" :init-param="pageDictListParams" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
          <!-- 表格 header 按钮 -->
          <template #tableHeader="scope">
            <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增字典</el-button>
            <el-button type="primary" :icon="Upload" plain @click="batchDeleteDict(scope.selectedListIds)">删除字典</el-button>
          </template>
          <!-- 表格操作 -->
          <template #operation="scope">
            <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
            <el-button type="primary" link :icon="Delete" @click="deleteDictDate(scope.row.id)">删除</el-button>
          </template>
        </ProTable>
      </div>
      <DictDataDrawer ref="drawerRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="DictManage">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, FormRules, ElMessageBox } from "element-plus";
import TreeFilter from "@/components/TreeFilter/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import DictDataDrawer from "./dictDataDrawer.vue";
import { getDictTypeListByParentId, getDictTypeInfo, saveDictType, removeDictType, getDictDataListByDictType, saveDictData, removeDictData, removeBatchDictData } from "@/api/modules/dictApi";
import { Dict } from "@/api/interface/dict";
import { dictDataStatus } from "@/utils/dict";
import { CirclePlus, Delete, EditPen, Upload } from "@element-plus/icons-vue";
import { cloneDeep } from "lodash";
// 获取 ProTable 实例
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
const proTable = ref<ProTableInstance>();
// 获取表单实例
const dictFormRef = ref<FormInstance>();
// 获取树形实例
// 打开 drawer(新增、查看、编辑)
const treeFilterRef = ref<InstanceType<typeof TreeFilter> | null>(null);

let dictTypeForm = reactive<Dict.DictType>({
  id: "",
  status: 1,
  dictSort: 1
});

const pageDictListParams = reactive<Dict.DictData>({
  dictTypeId: ""
});

const currentNode = reactive<Dict.DictType>({
  id: ""
});

/**
 * 表单验证规则
 */
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入字典分类名称", trigger: "blur" }],
  type: [{ required: true, message: "请输入字典分类标识", trigger: "blur" }],
  status: [{ required: true, message: "请选择字典分类状态", trigger: "blur" }],
  dictSort: [{ required: true, message: "请输入字典分类排序码", trigger: "blur" }]
});

/**
 * 保存字典类型
 * 保存后更新到字典树
 * @param formEl form对象
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      let { data, state, message } = await saveDictType(dictTypeForm);
      if (state === 200) {
        ElMessage.success(message);
        if (!dictTypeForm.id) {
          updateNode("add", "", dictTypeForm.parentId!);
        } else {
          updateNode("edit", dictTypeForm.id, dictTypeForm.parentId!);
        }
      } else {
        ElMessage.error(message);
      }

      let newNode = cloneDeep(dictTypeForm);
      newNode.id = data;
      treeFilterRef.value?.treeRef?.append(newNode, currentNode);
    }
  });
};

/**
 * 新增、修改、删除菜单时，重新渲染左侧树
 * @param aprentId 父级ID,删除时该id为删除对象的父级
 */
const defaultExpandedKeys = ref<string[]>([]);
const defaultValue = ref<string>("");
const updateNode = async (updateFlag: string, id: string, parentId: string) => {
  let { data } = await getDictTypeListByParentId({ parentId: parentId });
  treeFilterRef.value?.treeRef?.updateKeyChildren(parentId, data);
  defaultValue.value = updateFlag === "add" || updateFlag === "delete" ? parentId : id;
  defaultExpandedKeys.value.push(parentId);
};

/**
 * 重置表单
 * @param formEl 表单对象
 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

/**
 * 点击左侧树节点的回调
 * @param node
 */

const leftTreeHandleNodeClick = async (node: { [key: string]: any }) => {
  Object.assign(currentNode, node);
  if (node.id === "root") return;
  const { data } = await getDictTypeInfo(node.id);
  Object.assign(dictTypeForm, data);
  dictTypeForm.name = node.name;
  pageDictListParams.dictTypeId = node.id;
};

/**
 * 新增子集字典分类
 * @param formEl 表单对象
 */
const addDictType = (formEl: FormInstance | undefined) => {
  resetForm(formEl);
  dictTypeForm.id = "";
  dictTypeForm.parentId = currentNode.id ? currentNode.id : "root";
};

/**
 * 保存字典分类信息
 */
const clickRemoveOrg = async () => {
  ElMessageBox.confirm(`是否确认删除该菜单?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    const res = await removeDictType(currentNode.id ? currentNode.id : "");
    if (res.state === 200) {
      ElMessage({ type: "success", message: `删除成功!` });
      updateNode("delete", "", currentNode.parentId!);
    } else {
      ElMessage({ type: "warning", message: res.message });
    }
  });
};
// 初始化用户用户状态数据
const dictDataStatusEnum = ref<typeof dictDataStatus>([
  { label: "正常", value: 1, tagType: "success" },
  { label: "禁用", value: 2, tagType: "danger" }
]);

// 表格配置项
const columns = reactive<ColumnProps<Dict.DictData>[]>([
  { type: "index", label: "序号", width: 80 },
  { type: "selection", fixed: "left", width: 70 },
  { prop: "label", label: "字典名称" },
  { prop: "value", label: "字典值" },
  { prop: "tagType", label: "字典标签" },
  { prop: "dictStatus", label: "字典状态", tag: true, enum: dictDataStatusEnum },
  { prop: "dictSort", label: "字典排序" },
  { prop: "operation", label: "操作", width: 320, fixed: "right" }
]);

/**
 * 打开新增字典页面
 */
const drawerRef = ref<InstanceType<typeof DictDataDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Dict.DictData> = { dictTypeId: pageDictListParams.dictTypeId }) => {
  if (!pageDictListParams.dictTypeId) {
    ElMessage.warning("请先选择字典分类！");
    return;
  }
  const params = { title, row: { ...row }, isView: title === "查看", api: saveDictData, getTableList: proTable.value?.getTableList };
  drawerRef.value?.acceptParams(params);
};

const deleteDictDate = (dictId: string) => {
  ElMessageBox.confirm(`是否确认删除该数据字典?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    const res = await removeDictData(dictId);
    if (res.state === 200) {
      ElMessage({ type: "success", message: `删除成功!` });
    } else {
      ElMessage({ type: "warning", message: res.message });
    }
    proTable.value?.getTableList();
  });
};

// 批量删除用户信息
const batchDeleteDict = async (id: string[]) => {
  if (id.length <= 0) {
    ElMessage.warning("请先选择需要删除的字典信息！");
    return;
  }
  ElMessageBox.confirm(`是否确认删除该数据字典?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    const res = await removeBatchDictData(id);
    if (res.state === 200) {
      ElMessage({ type: "success", message: `删除成功!` });
    } else {
      ElMessage({ type: "warning", message: res.message });
    }
    proTable.value?.clearSelection();
    proTable.value?.getTableList();
  });
};
</script>
<style scoped lang="scss">
.menu_tree_class {
  width: calc(100% - 230px);
}
:deep(.el-tree-node__content) {
  font-weight: 500;
}
.form_button_class {
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: center;
    margin: 0;
  }
}
</style>
