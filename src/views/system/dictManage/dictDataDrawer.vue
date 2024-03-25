<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}接口`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView" :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="字典名称" prop="label">
        <el-input v-model="drawerProps.row!.label" placeholder="请填写字典名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="字典键值" prop="value">
        <el-input v-model="drawerProps.row!.value" placeholder="请填写字典键值" clearable></el-input>
      </el-form-item>

      <el-form-item label="字典排序" prop="dictSort">
        <el-input v-model="drawerProps.row!.dictSort" placeholder="请填写字典排序码" clearable></el-input>
      </el-form-item>
      <el-form-item label="字典状态" prop="dictStatusArr">
        <el-checkbox-group v-model="drawerProps.row!.dictStatusArr" placeholder="请选择字典状态" @change="dictStatusChange">
          <el-checkbox :label="1">正常</el-checkbox>
          <el-checkbox :label="0">禁用</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="字典标签">
        <el-input v-model="drawerProps.row!.tagType" placeholder="请填写字典标签" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="DictDataDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Dict } from "@/api/interface/dict";
const rules = reactive({
  label: [{ required: true, message: "请输入字典名称" }],
  value: [{ required: true, message: "请输入字典值" }],
  tagType: [{ required: true, message: "请输入字典值" }],
  dictSort: [{ required: true, message: "请输入字典排序" }],
  dictStatusArr: [{ required: true, message: "请选择字典状态" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Dict.DictData>;
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
      let res = await drawerProps.value.api!(drawerProps.value.row);
      console.log("11", res);
      if (res.state === 200) {
        ElMessage.success({ message: `${drawerProps.value.title}字典成功！` });
      } else {
        ElMessage.error({ message: `${drawerProps.value.title}字典失败！` + res.message });
      }

      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

const dictStatusChange = () => {
  if (drawerProps.value.row.dictStatusArr!.length > 1) {
    drawerProps.value.row!.dictStatusArr!.splice(0, 1);
    drawerProps.value.row!.dictStatus = drawerProps.value.row!.dictStatusArr![0];
  } else {
    drawerProps.value.row!.dictStatus = drawerProps.value.row!.dictStatusArr![0];
  }
};

defineExpose({
  acceptParams
});
</script>
