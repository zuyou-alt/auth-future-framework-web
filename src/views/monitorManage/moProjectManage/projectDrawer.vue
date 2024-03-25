<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}项目`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView" :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写应用名称" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="ApplicationDrawer">
import { ref, reactive } from "vue";
import { Project } from "@/api/interface/monitor/project";
import { ElMessage, FormInstance } from "element-plus";
const rules = reactive({
  name: [{ required: true, message: "请填写项目名称" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Project.ProjectInfo>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      console.log(drawerProps.value.row);
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}接口成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
