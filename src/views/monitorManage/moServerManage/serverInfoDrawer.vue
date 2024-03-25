<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}服务器`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView" :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="所属应用" prop="appName">
        <el-input v-model="drawerProps.row!.appName" disabled clearable></el-input>
      </el-form-item>
      <el-form-item label="服务器名称" prop="serverName">
        <el-input v-model="drawerProps.row!.serverName" placeholder="请填写服务器名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="服务器IP" prop="serverIp">
        <el-input v-model="drawerProps.row!.serverIp" placeholder="请填写服务器IP" clearable></el-input>
      </el-form-item>
      <el-form-item label="服务器端口" prop="serverPort">
        <el-input v-model="drawerProps.row!.serverPort" placeholder="请填写服务器端口" clearable></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="userName">
        <el-input v-model="drawerProps.row!.userName" placeholder="请填写账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="drawerProps.row!.password" placeholder="请填写密码" clearable></el-input>
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
import { ElMessage, FormInstance } from "element-plus";
import { Server } from "@/api/interface/monitor/server";

const rules = reactive({
  serverName: [{ required: true, message: "请填写服务器名称" }],
  serverIp: [{ required: true, message: "请填写服务器IP" }],
  serverPort: [{ required: true, message: "请填写服务器端口" }],
  userName: [{ required: true, message: "请填写账号" }],
  password: [{ required: true, message: "请填写密码" }],
  appName: [{ required: true, message: "请填写密码" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Server.ServerInfo>;
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
      console.log(drawerProps.value.row);
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}服务器成功！` });
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
