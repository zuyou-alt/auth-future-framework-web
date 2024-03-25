<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}接口`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView" :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="应用名称" prop="appName">
        <el-input v-model="drawerProps.row!.appName" placeholder="请填写应用名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="应用标识" prop="appKey">
        <el-input v-model="drawerProps.row!.appKey" placeholder="请填写应用标识" clearable></el-input>
      </el-form-item>
      <el-form-item label="应用类型" prop="typeStr">
        <el-checkbox-group v-model="drawerProps.row!.typeStr" @change="appTypeChange">
          <el-checkbox v-for="item in moAppTypeTypeEnum" :key="item.value" :label="item.value" :value="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId">
        <el-select v-model="drawerProps.row!.projectId" placeholder="请选择所属项目" clearable>
          <el-option v-for="item in projectDataEnum" :key="item.id" :label="item.label" :value="item.value!" />
        </el-select>
      </el-form-item>
      <el-form-item label="应用状态" prop="appStatusStr">
        <el-checkbox-group v-model="drawerProps.row!.appStatusStr" @change="appStatusChange">
          <el-checkbox v-for="item in appStatusEnum" :key="item.value" :label="item.value" :value="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="应用描述" prop="appDes">
        <el-input v-model="drawerProps.row!.appDes" type="textarea" />
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
import { MoApp } from "@/api/interface/monitor/moApp";
const rules = reactive({
  appName: [{ required: true, message: "请填写应用名称" }],
  appKey: [{ required: true, message: "请填写应用标识" }],
  typeStr: [{ required: true, message: "请选择应用类型" }],
  appStatusStr: [{ required: true, message: "请选择应用状态" }],
  projectId: [{ required: true, message: "请选择所属项目" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<MoApp.MoAppInfo>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let projectDataEnum = ref<Dict.DictData[]>([]);
let moAppTypeTypeEnum = ref<Dict.DictData[]>([]);
let appStatusEnum = ref<Dict.DictData[]>([]);

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  projectDataEnum.value = params.row.projectDataEnum!;
  let { data: dictData } = await getBatchDict(["mo_app_type", "mo_app_status"]);
  moAppTypeTypeEnum.value = dictData.filter(item => item.dictType === "mo_app_type")[0]!.dictDataCommonList;
  appStatusEnum.value = dictData.filter(item => item.dictType === "mo_app_status")[0]!.dictDataCommonList;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      console.log(drawerProps.value.row);
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}应用成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const appTypeChange = () => {
  if (drawerProps.value.row.typeStr!.length > 1) {
    drawerProps.value.row!.typeStr!.splice(0, 1);
    drawerProps.value.row!.type = parseInt(drawerProps.value.row!.typeStr![0]);
    return;
  }
  if (drawerProps.value.row.typeStr!.length === 1) {
    drawerProps.value.row!.type = parseInt(drawerProps.value.row!.typeStr![0]);
    return;
  }
};

const appStatusChange = () => {
  if (drawerProps.value.row.appStatusStr!.length > 1) {
    drawerProps.value.row!.appStatusStr!.splice(0, 1);
    drawerProps.value.row!.appStatus = drawerProps.value.row!.appStatusStr![0];
  }
  if (drawerProps.value.row.appStatusStr!.length === 1) {
    drawerProps.value.row!.appStatus = drawerProps.value.row!.appStatusStr![0];
    return;
  }
};

defineExpose({
  acceptParams
});
</script>
