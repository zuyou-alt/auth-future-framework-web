<template>
  <div style="width: 100%">
    <el-upload :before-upload="beforeExcelUpload" :show-file-list="false" :http-request="uplocadFile" :multiple="props.multiple" :limit="props.fileNum">
      <el-button type="primary">{{ props.buttonName }}</el-button>
      <template #tip>
        <slot name="tip">
          <div class="el-upload__tip">允许上传的文件格式为：{{ props.fileType.join(",") }}，单个文件最大不超过： {{ props.fileSize }}M</div>
        </slot>
      </template>
    </el-upload>
    <el-scrollbar height="100px" always>
      <div v-for="(item, index) in props.fileList" :key="item.id" style="display: flex; padding-right: 10px">
        <el-tooltip :content="item.originalFileName">
          <span class="fileName_class"> {{ index + 1 }}、 {{ item.originalFileName }} </span>
        </el-tooltip>
        <div style="padding-right: 10px; margin-left: auto; cursor: pointer" @click="downloadFile(item)">
          <el-icon><Download /></el-icon>
        </div>
        <div style="cursor: pointer" @click="deleteFileInfo(item)">
          <el-icon color="red"><Delete /></el-icon>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="UploadImg">
import { ref } from "vue";
import { uploadFileApi, removeFileInfoApi, downloadFileApi } from "@/api/modules/upload";
import { File } from "@/api/interface/file";
import { useDownload } from "@/hooks/useDownload";
import { ElNotification, ElMessage, UploadRequestOptions, UploadRawFile } from "element-plus";
const d = ref<string>("");
console.log(typeof d.value); // 输出: "string"
interface UploadFileProps {
  api?: (params: any) => Promise<any>; // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
  fileSize?: number; // 文件大小限制 ==> 非必传（默认为 5M）
  fileNum?: number; // 文件个数限制 ==> 费必传 默认为5个
  fileType: string[]; // 文件限制类型 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  height?: string; // 组件高度 ==> 非必传（默认为 150px）
  width?: string; // 组件宽度 ==> 非必传（默认为 150px）
  borderRadius?: string; // 组件边框圆角 ==> 非必传（默认为 8px）
  buttonName?: string; // 上传按钮名称 ==> 非必传
  fileList?: File.FileInfo[];
  params?: object;
  multiple?: boolean; // 是否允许多选 ==> 非必传默认允许
}

// 接受父组件参数
const props = withDefaults(defineProps<UploadFileProps>(), {
  drag: true,
  disabled: false,
  fileSize: 5,
  fileNum: 5,
  height: "150px",
  width: "150px",
  borderRadius: "8px",
  buttonName: "文件上传",
  multiple: true
});

// 文件上传
const uplocadFile = async (param: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", param.file);
  let { state, data, message } = await uploadFileApi!(formData);
  if (state === 200) {
    props.fileList!.push(data);
  } else {
    console.log(message);
  }
};

/**
 * @description 文件上传之前判断
 * @param file 上传的文件
 * */
const beforeExcelUpload = (file: UploadRawFile) => {
  let isAllow = false;
  if (props.fileType!.includes("*")) {
    isAllow = true;
  } else {
    let fileName = file.name ? file.name : "";
    let index = fileName.lastIndexOf(".");
    let suffix = fileName.substring(index + 1, fileName.length);
    isAllow = props.fileType!.includes(suffix);
  }

  const fileSize = file.size / 1024 / 1024 < props.fileSize!;
  if (!isAllow)
    ElNotification({
      title: "温馨提示",
      message: `上传文件只能是[${props.fileType}]格式！`,
      type: "warning"
    });
  if (!fileSize)
    setTimeout(() => {
      ElNotification({
        title: "温馨提示",
        message: `上传文件大小不能超过 ${props.fileSize}MB！`,
        type: "warning"
      });
    }, 0);
  return isAllow && fileSize;
};

/**
 * 删除文件信息
 * @param row 文件信息行
 */
const deleteFileInfo = async (row: File.FileInfo) => {
  let { state, message } = await removeFileInfoApi({ id: row.id, removeFile: false });
  if (state === 200) {
    props.fileList!.splice(
      props.fileList!.findIndex(item => item.id === row.id),
      1
    );
  } else {
    ElMessage.error(message);
  }
};

/**
 * 点击文件下载
 * @param row 文件信息
 */
const downloadFile = async (row: File.FileInfo) => {
  useDownload(downloadFileApi, row.name!, { id: row.id }, false, "." + row.ext);
};

defineExpose({
  props
});
</script>
<style lang="scss" scoped>
.fileName_class {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
