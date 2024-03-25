<template>
  <div class="main-box">
    <TreeFilter ref="menuTreeRef" label="menuTitle" title="组织列表(单选)" :default-value="defaultValue" :data="treeAllData" :default-expanded-keys="defaultExpandedKeys" :default-expand-all="false" @change="clickLeftNode" />
    <div class="card menu_tree_class">
      <div style="margin: 20px">
        <el-button type="primary" :icon="CirclePlus" @click="clickAddMenu(ruleFormRef)">新增菜单</el-button>
        <el-button type="danger" :icon="Delete" plain @click="clickRemoveMenu">删除菜单</el-button>
      </div>
      <el-form ref="ruleFormRef" :model="menuForm" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="上级菜单" prop="menuParentName">
              <el-select v-model="menuForm.menuParentName" placeholder="请选择上级菜单" style="width: 100%" @visible-change="selectChange">
                <el-input v-model="filterText" placeholder="请输入筛选条件" style="width: 96%; margin: 10px" />
                <el-option :value="menuForm.menuParentId" :label="menuForm.menuParentName" style="min-height: 200px; max-height: 300px; padding: 0; overflow-y: auto; background-color: #ffffff">
                  <el-tree :expand-on-click-node="false" ref="selectTree" :data="treeAllData" :props="defaultProps" @node-click="handleNodeClick" :filter-node-method="filterNode"> </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuForm.menuType" placeholder="请选择菜单类型">
                <el-radio v-for="item in menuTypeEnum" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuTitle">
              <el-input v-model="menuForm.menuTitle" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由名称" prop="menuName">
              <el-input v-model="menuForm.menuName" placeholder="请输入路由名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="menuPath">
              <el-input v-model="menuForm.menuPath" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组件地址" prop="menuComponent">
              <el-input v-model="menuForm.menuComponent" placeholder="请输入组件地址，view后一层开始" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份控制" prop="menuIdentity">
              <el-checkbox-group v-model="menuForm.menuIdentityList">
                <el-checkbox v-for="item in userIdentityEnum" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="选择图标" prop="menuIcon">
              <SelectIcon v-model:icon-value="menuForm.menuIcon" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单排序" prop="menuSort">
              <el-input v-model="menuForm.menuSort" placeholder="请输入菜单排序" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外链地址" prop="menuUrl">
              <el-input v-model="menuForm.menuUrl" placeholder="请输入组件地址，view后一层开始" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否显示" prop="menuShow">
              <el-radio-group v-model="menuForm.menuShow" placeholder="请选择菜单类型">
                <el-radio label="0">不显示</el-radio>
                <el-radio label="1">显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否外链" prop="menuOutside">
              <el-radio-group v-model="menuForm.menuOutside" placeholder="请选择菜单类型">
                <el-radio label="0">不是</el-radio>
                <el-radio label="1">是</el-radio>
              </el-radio-group>
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
import { ref, reactive, onBeforeMount, watch } from "vue";
import { ElTree, ElMessage, FormInstance, FormRules, ElMessageBox } from "element-plus";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { queryMenuAllListTreeApi, getMenuInfoApi, saveMuneInfoApi, removeMenuInfoApi, queryMenuListParentIdApi } from "@/api/modules/menuApi";
import { Menu } from "@/api/interface/menu";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
import SelectIcon from "@/components/SelectIcon/index.vue";

const ruleFormRef = ref<FormInstance>();
const menuForm = reactive<Menu.MenuInfo>({
  menuType: "menu",
  menuShow: "1",
  menuSort: 0,
  menuOutside: "0",
  menuIdentity: "10000",
  menuIdentityList: [],
  menuParentId: ""
});

// 获取树形实例
const menuTreeRef = ref<InstanceType<typeof TreeFilter> | null>(null);
interface Tree {
  [key: string]: any;
}
const treeAllData = ref<Menu.MenuInfo[]>([]);
const filterText = ref("");
const selectTree = ref<InstanceType<typeof ElTree>>();
/**
 * 下拉树的属性配置
 */
const defaultProps = {
  children: "children",
  label: "menuTitle",
  id: "id"
};
// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let menuTypeEnum = ref<Dict.DictData[]>([]);
let userIdentityEnum = ref<Dict.DictData[]>([]);
/**
 * 初始化时：
 * 1. 获取完整的菜单数据
 * 2. 默认展开系统级的节点
 * 3. 默认选中第一个节点
 */
const defaultExpandedKeys = ref<string[]>([]);
const defaultValue = ref<string>("");
onBeforeMount(async () => {
  // 获取菜单树
  const { data } = await queryMenuAllListTreeApi();
  // 设置默认展开的菜单
  data.forEach(menu => {
    if (menu.menuType === "system") {
      defaultExpandedKeys.value.push(menu.id!);
    }
  });
  // 设置树节点数据
  treeAllData.value = [...data];
  // 设置默认选中数据
  defaultValue.value = treeAllData.value[0].id!;
  // 获取默认选中的数据的详情
  const { data: menuData } = await getMenuInfoApi(treeAllData.value[0].id!);
  Object.assign(menuForm, menuData);
  menuForm.menuIcon = menuData.menuIcon;
  menuForm.menuShow = menuData.menuShow + "";
  menuForm.menuOutside = menuData.menuOutside + "";
  // 获取必要数据字典
  let { data: dictData } = await getBatchDict(["menu_type", "user_identity"]);
  menuTypeEnum.value = dictData.filter(item => item.dictType === "menu_type")[0].dictDataCommonList;
  userIdentityEnum.value = dictData.filter(item => item.dictType === "user_identity")[0].dictDataCommonList;
});

/**
 * 监听下拉树的输入框的变化，过滤数据
 */
watch(filterText, val => selectTree.value!.filter(val));

/**
 * 下拉树过滤方法
 * @param value 过滤条件
 * @param data 被过滤的数据
 */
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.menuTitle.includes(value);
};

/**
 * 点击下拉树的回调方法
 * @param node 树节点数据
 */
const handleNodeClick = (node: Menu.MenuInfo) => {
  menuForm.menuParentName = node.menuTitle;
  menuForm.menuParentId = node.id!;
};

/**
 * 表单验证规则
 */
const rules = reactive<FormRules>({
  menuTitle: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  menuName: [{ required: true, message: "请输入路由名称", trigger: "blur" }],
  menuComponent: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  menuPath: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
  // menuParentName: [{ required: true, message: "请选择父级菜单", trigger: "blur" }],
  menuType: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  menuIdentity: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  menuIcon: [{ required: true, message: "请选择菜单图标", trigger: "blur" }]
});

/**
 * 保存菜单
 * @param formEl form对象
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      menuForm.menuIdentity = menuForm.menuIdentityList!.join(",");
      let { state, message } = await saveMuneInfoApi(menuForm);
      if (state === 200) {
        ElMessage.success("保存成功！");
        // 更新节点数据
        updateNode(leftTreeNode.id);
      } else {
        ElMessage.error(message);
      }
    }
  });
};

/**
 * 新增、修改、删除菜单时，重新渲染左侧树
 * @param prentId 父级ID,删除时该id为删除对象的父级
 */
const updateNode = async (prentId: string) => {
  let { data } = await queryMenuListParentIdApi(prentId);
  menuTreeRef.value?.treeRef?.updateKeyChildren(prentId, data);
  defaultValue.value = prentId;
  defaultExpandedKeys.value.push(prentId);
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
 * 会将点击的数据存储至leftTreeNode中
 * @param node 节点数据
 */
const leftTreeNode = reactive<any>({});
const clickLeftNode = async (node: { [key: string]: any }) => {
  const { data } = await getMenuInfoApi(node.id);
  Object.assign(menuForm, data);
  menuForm.menuIcon = data.menuIcon;
  menuForm.menuShow = data.menuShow + "";
  menuForm.menuOutside = data.menuOutside + "";
  Object.assign(leftTreeNode, data);
};

/**
 * 下拉树选择完成后，清空筛选内容
 */
const selectChange = () => {
  filterText.value = "";
};

/**
 * 点击新增菜单
 * @param formEl 表单对象
 */
const clickAddMenu = (formEl: FormInstance | undefined) => {
  resetForm(formEl);
  menuForm.id = "";
  menuForm.menuParentId = leftTreeNode.id;
  menuForm.menuParentName = leftTreeNode.menuTitle;
};

/**
 * 根据ID删除菜单（点击删除菜单按钮）
 */
const clickRemoveMenu = async () => {
  ElMessageBox.confirm(`是否确认删除该菜单?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    const res = await removeMenuInfoApi(leftTreeNode.id);
    if (res.state === 200) {
      ElMessage({ type: "success", message: `删除成功!` });
      // 更新节点数据
      updateNode(leftTreeNode.menuParentId);
    } else {
      ElMessage({ type: "error", message: res.message });
    }
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
