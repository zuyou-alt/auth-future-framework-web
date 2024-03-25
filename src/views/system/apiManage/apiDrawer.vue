<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}接口`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView" :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="接口名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写接口名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="接口前缀" prop="patternPre">
        <el-input v-model="drawerProps.row!.patternPre" placeholder="请填写接口前缀" clearable></el-input>
      </el-form-item>
      <el-form-item label="接口路径" prop="pattern">
        <el-input v-model="drawerProps.row!.pattern" placeholder="请填写接口路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="接口类型" prop="apiMethod">
        <el-select v-model="drawerProps.row.apiMethod" placeholder="请选择接口类型">
          <el-option v-for="item in apiTypeEnum" :key="item.value" :label="item.label" :value="item.value!" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属模块" prop="modelName">
        <el-input v-model="drawerProps.row!.modelName" placeholder="请填写接口模块" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属应用" prop="appName">
        <el-input v-model="drawerProps.row!.appName" placeholder="请填写接口模块" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="ApiDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Api } from "@/api/interface/apiInfo";
const rules = reactive({
  name: [{ required: true, message: "请填写接口名称" }],
  pattern: [{ required: true, message: "请填写接口路径" }],
  patternPre: [{ required: true, message: "请填写接口前缀" }],
  modelName: [{ required: true, message: "请填写接口模块" }],
  appId: [{ required: true, message: "请填写电话号码" }],
  apiMethod: [{ required: true, message: "请填写电话号码" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Api.ApiInfo>;
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
let apiTypeEnum = ref<Dict.DictData[]>([]);

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  console.log(params);
  drawerVisible.value = true;
  let { data } = await getBatchDict(["api_type"]);
  apiTypeEnum.value = data.filter(item => item.dictType === "api_type")[0]!.dictDataCommonList;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
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
