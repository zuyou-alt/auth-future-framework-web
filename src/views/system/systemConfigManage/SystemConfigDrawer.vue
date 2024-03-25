<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}接口`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView" :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请输入配置名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="配置标识" prop="configKey">
        <el-input v-model="drawerProps.row!.configKey" placeholder="请输入配置key" clearable></el-input>
      </el-form-item>
      <el-form-item label="配置状态" prop="configEnableArr">
        <el-checkbox-group v-model="drawerProps.row!.configEnableArr" placeholder="请选择是否启用" @change="dictStatusChange">
          <el-checkbox :label="1">正常</el-checkbox>
          <el-checkbox :label="0">禁用</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="配置内容" prop="configContent">
        <el-input v-model="drawerProps.row!.configContent" type="textarea" :rows="4" placeholder="请输入配置内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="配置说明" prop="configDes">
        <el-input v-model="drawerProps.row!.configDes" type="textarea" :rows="4" placeholder="请输入配置说明" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="SystemConfigDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { SystemConfig } from "@/api/interface/systemConfig";
const rules = reactive({
  name: [{ required: true, message: "请输入配置名称" }],
  configKey: [{ required: true, message: "请输入配置标识" }],
  configEnableArr: [{ required: true, message: "请选择是否启用" }],
  configContent: [{ required: true, message: "请输入配置内容" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<SystemConfig.ConfigInfo>;
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
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let res = await drawerProps.value.api!(drawerProps.value.row);
      if (res.state === 200) {
        ElMessage.success({ message: `${drawerProps.value.title}配置成功！` });
      } else {
        ElMessage.error({ message: `${drawerProps.value.title}配置失败！` + res.message });
      }

      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const dictStatusChange = () => {
  if (drawerProps.value.row.configEnableArr!.length > 1) {
    drawerProps.value.row!.configEnableArr!.splice(0, 1);
    drawerProps.value.row!.configEnable = drawerProps.value.row!.configEnableArr![0]!;
  } else {
    drawerProps.value.row!.configEnable = drawerProps.value.row!.configEnableArr![0];
  }
};

defineExpose({
  acceptParams
});
</script>
