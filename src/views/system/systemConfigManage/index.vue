<template>
  <div class="main-box">
    <TreeFilter ref="treeFilterRef" label="name" title="配置分类" :lazy="true" :request-api="queryConfigClassifyListByParentIdApi" :default-value="defaultValue" :default-expand-all="false" @change="leftTreeHandleNodeClick" />
    <div class="card menu_tree_class">
      <span class="config_title_class">配置分类管理</span>
      <el-divider style="margin: 10px 0" />
      <div style="margin: 20px">
        <el-button type="primary" :icon="CirclePlus" @click="addConfigClassify(ConfigClassifyFormRef)">新增分类</el-button>
        <el-button type="danger" :icon="Delete" plain @click="clickRemoveConfigClassify">删除分类</el-button>
      </div>
      <el-form ref="ConfigClassifyFormRef" :model="configClassifyForm" :rules="rules" label-width="90px" style="margin-bottom: 50px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="configClassifyForm.name" placeholder="请输入字典分类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类排序" prop="sort">
              <el-input v-model="configClassifyForm.sort" placeholder="请输入字典分类排序" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分类类型" prop="type">
              <el-radio-group v-model="configClassifyForm.type">
                <el-radio label="system">系统</el-radio>
                <el-radio label="config">配置</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用标识" prop="appKey">
              <el-input v-model="configClassifyForm.appKey" placeholder="请输入应用标识" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="form_button_class">
          <el-button type="primary" @click="submitForm(ConfigClassifyFormRef)"> 保存分类 </el-button>
          <el-button @click="resetForm(ConfigClassifyFormRef)"> 重置表单 </el-button>
        </el-form-item>
      </el-form>
      <span class="config_title_class">配置管理</span>
      <el-divider style="margin: 10px 0" />
      <div style="height: 380px">
        <ProTable ref="proTable" row-key="id" :table-height="'380px'" :pagination="false" :indent="20" :columns="columns" :request-auto="false" :request-api="queryConfigInfoListByConfigClassifyId" :init-param="pageConfigListParams" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
          <!-- 表格 header 按钮 -->
          <template #tableHeader="scope">
            <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增配置</el-button>
            <el-button type="danger" :icon="Delete" plain @click="batchDeleteDict(scope.selectedListIds)">删除配置</el-button>
          </template>
          <!-- 表格操作 -->
          <template #operation="scope">
            <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
            <el-button type="primary" link :icon="EditPen" @click="publishConfig(scope.row.id)">发布</el-button>
            <el-button type="primary" link :icon="View" @click="openHistoryDrawer('查看历史版本', scope.row)">查看历史版本</el-button>
            <el-button type="danger" link :icon="Delete" @click="deleteSystemConfig(scope.row.id)">删除</el-button>
          </template>
        </ProTable>
      </div>
      <SystemConfigDrawer ref="drawerRef" />
      <HistoryDrawer ref="historyDrawerRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="SystemConfig">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, FormInstance, FormRules, ElMessageBox } from "element-plus";
import TreeFilter from "@/components/TreeFilter/index.vue";
import ProTable from "@/components/ProTable/index.vue";
import SystemConfigDrawer from "./SystemConfigDrawer.vue";
import HistoryDrawer from "./historyDrawer.vue";
import { queryConfigClassifyListByParentIdApi, saveConfigClassifyApi, publishConfigApi, removeConfigClassifyApi, removeBatchConfigInfoApi, removeConfigInfoApi, saveConfigInfoApi, queryConfigInfoListByConfigClassifyId, getConfigClassifyInfoApi } from "@/api/modules/systemConfigApi";
import { SystemConfig } from "@/api/interface/systemConfig";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
const proTable = ref<ProTableInstance>();
const ConfigClassifyFormRef = ref<FormInstance>();
const treeFilterRef = ref<InstanceType<typeof TreeFilter> | null>(null);

let configClassifyForm = reactive<SystemConfig.ConfigClassifyInfo>({
  id: "",
  type: "config",
  sort: 1
});
const pageConfigListParams = reactive<SystemConfig.ConfigInfo>({});

/**
 * 表单验证规则
 */
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入配置分类名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择配置分类类型", trigger: "blur" }],
  sort: [{ required: true, message: "请输入配置分类排序", trigger: "blur" }],
  appKey: [{ required: true, message: "请输入应用标识", trigger: "blur" }]
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
      let { state, message } = await saveConfigClassifyApi(configClassifyForm);
      if (state === 200) {
        ElMessage.success(message);
        if (!configClassifyForm.id) {
          updateNode("add", "", configClassifyForm.parentId!);
        } else {
          updateNode("edit", configClassifyForm.id, configClassifyForm.parentId!);
        }
      } else {
        ElMessage.error(message);
      }
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
  let { data } = await queryConfigClassifyListByParentIdApi({ parentId: parentId });
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
const currentNode = reactive<SystemConfig.ConfigClassifyInfo>({});
const leftTreeHandleNodeClick = async (node: { [key: string]: any }) => {
  Object.assign(currentNode, node);
  if (node.id === "root") return;
  const { data } = await getConfigClassifyInfoApi({ configClassifyId: node.id });
  Object.assign(configClassifyForm, data);
  configClassifyForm.name = node.name;
  pageConfigListParams.classifyId = node.id;
};

/**
 * 新增子集字典分类
 * @param formEl 表单对象
 */
const addConfigClassify = (formEl: FormInstance | undefined) => {
  resetForm(formEl);
  configClassifyForm.id = "";
  configClassifyForm.sort = 0;
  configClassifyForm.appKey = currentNode.appKey;
  configClassifyForm.parentId = currentNode.id ? currentNode.id : "root";
};

// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let configStatusEnum = ref<Dict.DictData[]>([]);
onMounted(async () => {
  let { data } = await getBatchDict(["config_status"]);
  configStatusEnum.value = data.filter(item => item.dictType === "config_status")[0].dictDataCommonList;
  configStatusEnum.value.forEach(item => (item.value = parseInt(item.value!)));
});

/**
 * 保存配置分类信息
 */
const clickRemoveConfigClassify = async () => {
  ElMessageBox.confirm(`是否确认删除该配置分类?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    const res = await removeConfigClassifyApi(currentNode.id ? currentNode.id : "");
    if (res.state === 200) {
      ElMessage({ type: "success", message: `删除成功!` });
      updateNode("delete", "", currentNode.parentId!);
    } else {
      ElMessage({ type: "warning", message: res.message });
    }
  });
};

const publishStatusEnum = ref<any>([
  { label: "已发布", value: 1, tagType: "success" },
  { label: "未发布", value: 0, tagType: "danger" }
]);

// 表格配置项
const columns = reactive<ColumnProps<SystemConfig.ConfigInfo>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { prop: "name", label: "配置名称" },
  { prop: "configKey", label: "配置标识" },
  { prop: "configContent", label: "配置内容" },
  { prop: "configEnable", label: "配置状态", enum: configStatusEnum },
  { prop: "publishStatus", label: "发布状态", tag: true, enum: publishStatusEnum },
  { prop: "operation", label: "操作", width: 350, fixed: "right" }
]);

/**
 * 点击新增配置
 */
const drawerRef = ref<InstanceType<typeof SystemConfigDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<SystemConfig.ConfigInfo> = {}) => {
  if (!currentNode.id) {
    ElMessage.warning("请先选择配置分类！");
    return;
  }
  if (currentNode.type === "system") {
    ElMessage.warning("系统分类下不允许新增配置");
    return;
  }
  const params = { title, row: { ...row, configEnableArr: [row.configEnable!], classifyId: currentNode.id, classifyName: currentNode.name, appKey: currentNode.appKey }, isView: title === "查看", api: saveConfigInfoApi, getTableList: proTable.value?.getTableList };
  drawerRef.value?.acceptParams(params);
};

/**
 * 查看历史版本
 */
const historyDrawerRef = ref<InstanceType<typeof HistoryDrawer> | null>(null);
const openHistoryDrawer = (title: string, row: Partial<SystemConfig.ConfigInfo> = {}) => {
  if (!currentNode.id) {
    ElMessage.warning("请先选择配置分类！");
    return;
  }
  if (currentNode.type === "system") {
    ElMessage.warning("系统分类下不允许新增配置");
    return;
  }
  const params = { title, row: { ...row, configEnableArr: [row.configEnable!], classifyId: currentNode.id, classifyName: currentNode.name, appKey: currentNode.appKey }, isView: title === "查看", api: saveConfigInfoApi, getTableList: proTable.value?.getTableList };
  historyDrawerRef.value?.acceptParams(params);
};

/**
 * 点击删除配置
 * @param configId 配置ID
 */
const deleteSystemConfig = (configId: string) => {
  ElMessageBox.confirm(`是否确认删除该配置?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    const res = await removeConfigInfoApi(configId);
    if (res.state === 200) {
      ElMessage({ type: "success", message: `删除成功!` });
    } else {
      ElMessage({ type: "warning", message: res.message });
    }
    proTable.value?.getTableList();
  });
};

/**
 * 点击发布配置
 * @param configId 配置ID
 */
const publishConfig = (configId: string) => {
  ElMessageBox.confirm(`是否确认发布该配置?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    const res = await publishConfigApi(configId);
    if (res.state === 200) {
      ElMessage({ type: "success", message: `发布成功!` });
    } else {
      ElMessage({ type: "warning", message: res.message });
    }
    proTable.value?.getTableList();
  });
};

/**
 * 点击批量删除配置
 * @param ids 配置ID集合
 */
const batchDeleteDict = async (ids: string[]) => {
  if (ids.length <= 0) {
    ElMessage.warning("请先选择需要删除的配置信息！");
    return;
  }
  ElMessageBox.confirm(`是否确认删除该配置?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    const res = await removeBatchConfigInfoApi(ids);
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
.config_title_class {
  margin: 0 0 15px;
  font-size: 18px;
  font-weight: bold;
  color: var(--el-color-info-dark-2);
  letter-spacing: 0.5px;
}
</style>
