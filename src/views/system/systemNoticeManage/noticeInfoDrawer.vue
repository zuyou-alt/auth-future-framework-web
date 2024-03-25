<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="800px" :close-on-click-modal="false" :title="`${drawerProps.title}接口`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView" :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="通知标题" prop="title">
        <el-input v-model="drawerProps.row!.title" placeholder="请填写通知标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="通知类型" prop="type">
        <el-select v-model="drawerProps.row!.type" placeholder="请选择通知类型" clearable>
          <el-option v-for="item in noticeTypeEnum" :key="item.value" :label="item.label" :value="item.value!" />
        </el-select>
      </el-form-item>
      <el-form-item label="通知内容" prop="type">
        <WangEditor v-model:value="content" height="400px" />
      </el-form-item>
      <el-form-item label="通知内容" prop="type">
        <FileUpload ref="fileUploadRef" :file-type="fileType" :file-list="fileList" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="NoticeInfoDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { File } from "@/api/interface/file";
import { Notice } from "@/api/interface/systemNotice";
//文本编辑器
import WangEditor from "@/components/WangEditor/index.vue";
// 编辑器内容
const content = ref("");

// 文件上传组件
import FileUpload from "@/components/Upload/file.vue";
import { queryFileListByIdApi } from "@/api/modules/upload";

const fileType = ref<string[]>(["*"]);

const rules = reactive({
  appName: [{ required: true, message: "请填写应用名称" }],
  appKey: [{ required: true, message: "请填写应用标识" }],
  authTypeList: [{ required: true, message: "请选择授权类型" }],
  scopeList: [{ required: true, message: "请选择授权范围" }],
  typeStr: [{ required: true, message: "请选择应用类型" }],
  beginTime: [{ required: true, message: "请选择生效时间" }],
  endTime: [{ required: true, message: "请选择到期时间" }],
  appStatusStr: [{ required: true, message: "请选择到期时间" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Notice.NoticeInfo>;
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
let noticeTypeEnum = ref<Dict.DictData[]>([]);

const getDict = async () => {
  let { data } = await getBatchDict(["notice_type"]);
  noticeTypeEnum.value = data.filter(item => item.dictType === "notice_type")[0]!.dictDataCommonList;
  noticeTypeEnum.value.forEach(item => (item.value = parseInt(item.value!)));
};

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  content.value = params.row.content!;
  getDict();
  getFileInfoList(params.row.attachments!);
};

const fileList = ref<File.FileInfo[]>([]);
const getFileInfoList = async (id: string) => {
  let { data } = await queryFileListByIdApi(id);
  fileList.value = data;
};

const fileUploadRef = ref<InstanceType<typeof FileUpload> | null>(null);
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let fileList = fileUploadRef.value?.props.fileList;
      let fileIds = fileList?.map(item => item.id);
      drawerProps.value.row.attachments = fileIds?.join(",");
      drawerProps.value.row.content = content.value;
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
