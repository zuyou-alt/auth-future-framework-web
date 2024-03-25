<template>
  <div class="main-box">
    <TreeFilter ref="orgTreeRef" label="name" title="组织列表" :lazy="true" :default-value="defaultValue" :request-api="getOrgListByParentIdApi" :default-expanded-keys="defaultExpandedKeys" :default-expand-all="false" @change="clickNode" />
    <div class="card org_info_form_class">
      <div style="margin: 20px">
        <el-button type="primary" :icon="CirclePlus" @click="clickAddOrg(ruleFormRef)">新增组织</el-button>
        <el-button type="danger" :icon="Delete" plain @click="clickRemoveOrg">删除组织</el-button>
      </div>
      <el-form ref="ruleFormRef" :model="orgForm" :rules="rules" label-width="90px">
        <el-form-item label="组织名称" prop="name">
          <el-input v-model="orgForm.name" placeholder="请输入组织名称" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织类型" prop="type">
              <el-radio-group v-model="orgForm.type" placeholder="请选择组织类型">
                <el-radio v-for="item in orgTypeEnum" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织排序" prop="orgSort">
              <el-input v-model="orgForm.orgSort" placeholder="请输入组织排序码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="组织描述" prop="intro">
              <el-input v-model="orgForm.intro" placeholder="请输入组织描述" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="form_button_class">
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 保存 </el-button>
          <el-button @click="resetForm(ruleFormRef)"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="menuMange">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, FormInstance, FormRules, ElMessageBox } from "element-plus";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { getOrgListByParentIdApi, saveOrganization, getOrganization, removeOrganization } from "@/api/modules/orgApi";
import { Org } from "@/api/interface/org";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
// 获取树形实例
const orgTreeRef = ref<InstanceType<typeof TreeFilter> | null>(null);

// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let orgTypeEnum = ref<Dict.DictData[]>([]);
onMounted(async () => {
  let { data } = await getBatchDict(["org_type"]);
  orgTypeEnum.value = data.filter(item => item.dictType === "org_type")[0].dictDataCommonList;
});
const ruleFormRef = ref<FormInstance>();
const orgForm = reactive<Org.OrgInfo>({
  id: "",
  name: "",
  parentId: "",
  parentName: "",
  intro: "",
  orgSort: 0,
  type: "",
  path: ""
});

const defaultExpandedKeys = ref<string[]>([]);
const defaultValue = ref<string>("");
/**
 * 表单验证规则
 */
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入组织名称", trigger: "blur" }],
  type: [{ required: true, message: "请输入组织类型", trigger: "blur" }],
  orgSort: [{ required: true, message: "请输入组织排序码", trigger: "blur" }]
});

/**
 * 提交表单的方法
 * @param formEl form对象
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      if (!orgForm.parentId) {
        orgForm.parentId = "root";
        currentNode.id = "root";
      }
      let { state, message } = await saveOrganization(orgForm);
      if (state === 200) {
        ElMessage.success("保存成功！");
        if (!orgForm.id) {
          updateNode("add", "", currentNode.id);
        } else {
          updateNode("edit", currentNode.id, currentNode.parentId);
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
const updateNode = async (updateFlag: string, id: string, parentId: string) => {
  let { data } = await getOrgListByParentIdApi({ parentId: parentId });
  orgTreeRef.value?.treeRef?.updateKeyChildren(parentId, data);
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
 * 点击左侧组织节点的回调
 * @param node
 */
const currentNode = reactive<any>({});
const clickNode = async (node: { [key: string]: any }) => {
  if (node.id === "root") return;
  const { data } = await getOrganization(node.id);
  Object.assign(orgForm, data);
  orgForm.parentName = node.name;
  Object.assign(currentNode, data);
};

/**
 * 点击新增组织
 * @param formEl 表单对象
 */
const clickAddOrg = (formEl: FormInstance | undefined) => {
  resetForm(formEl);
  orgForm.id = "";
  orgForm.parentId = currentNode.id;
};

/**
 * 删除组织
 */
const clickRemoveOrg = async () => {
  ElMessageBox.confirm(`是否确认删除该组织?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    const { state, message } = await removeOrganization(currentNode.id);
    if (state === 200) {
      ElMessage.success(message);
      updateNode("delete", "", currentNode.parentId);
    } else {
      ElMessage.error(message);
    }
  });
};
</script>
<style scoped lang="scss">
.org_info_form_class {
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
