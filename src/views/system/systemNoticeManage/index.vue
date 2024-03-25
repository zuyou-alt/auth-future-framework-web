<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable ref="proTable" row-key="id" :indent="20" :columns="columns" :request-auto="true" :request-api="pageNoticeListApi" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增通知</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link :icon="EditPen" @click="publishNotice(scope.row)">发布</el-button>
          <el-button type="primary" link :icon="Delete" @click="deleteAppInfo(scope.row.id)">删除</el-button>
        </template>
      </ProTable>
      <NoticeInfoDrawer ref="noticeInfoDrawerRef" />
    </div>
  </div>
</template>
<script setup lang="ts" name="u seTreeFilter">
import { ref, reactive, onMounted } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import { Notice } from "@/api/interface/systemNotice";
import { pageNoticeListApi, saveNoticeApi, removeNoticeApi, updatePublishStatusApi } from "@/api/modules/systemNoticeApi";
import ProTable from "@/components/ProTable/index.vue";
import NoticeInfoDrawer from "./noticeInfoDrawer.vue";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
// 获取 ProTable 实例
const proTable = ref<ProTableInstance>();

const publishStatusEnum = ref<any>([
  { label: "已发布", value: 1, tagType: "success" },
  { label: "未发布", value: 0, tagType: "danger" }
]);

// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let noticeTypeEnum = ref<Dict.DictData[]>([]);
onMounted(async () => {
  let { data } = await getBatchDict(["notice_type"]);
  noticeTypeEnum.value = data.filter(item => item.dictType === "notice_type")[0]!.dictDataCommonList;
  noticeTypeEnum.value.forEach(item => (item.value = parseInt(item.value!)));
});

// 表格配置项
const columns = reactive<ColumnProps<Notice.NoticeInfo>[]>([
  { type: "index", label: "序号", width: 80 },
  { prop: "title", label: "标题", align: "left", search: { el: "input", props: { placeholder: "请输入通知标题" } } },
  { prop: "type", label: "类型", align: "left", enum: noticeTypeEnum, search: { el: "select", props: { placeholder: "请选择通知类型" } } },
  { prop: "createTime", label: "创建时间", align: "left" },
  { prop: "publishTime", label: "发布时间", align: "left" },
  { prop: "timeList", label: "发布时间", align: "center", isHide: true, search: { el: "date-picker", props: { placeholder: "请选择发布时间", type: "datetimerange" } } },
  { prop: "publishStatus", label: "发布状态", align: "left", enum: publishStatusEnum, tag: true, search: { el: "select", props: { placeholder: "请选择发布状态" } } },
  { prop: "operation", label: "操作", width: 350 }
]);

// 打开 drawer(新增、查看、编辑)
const noticeInfoDrawerRef = ref<InstanceType<typeof NoticeInfoDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Notice.NoticeInfo> = {}) => {
  const params = { title, row: { ...row }, isView: title === "查看", api: title === "新增" ? saveNoticeApi : title === "编辑" ? saveNoticeApi : undefined, getTableList: proTable.value?.getTableList };
  noticeInfoDrawerRef.value?.acceptParams(params);
};

const deleteAppInfo = (appId: string) => {
  ElMessageBox.confirm(`是否确认删除该通知?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    let res = await removeNoticeApi(appId);
    if (res.state === 200) {
      ElMessage.success(res.message);
    } else {
      ElMessage.error(res.message);
    }
    proTable.value?.getTableList();
  });
};

/**
 * 发布通知
 * @param row 通知信息
 */
const publishNotice = async (row: Notice.NoticeInfo) => {
  ElMessageBox.confirm(`是否确认发布该通知?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    draggable: true
  }).then(async () => {
    let res = await updatePublishStatusApi({ id: row.id, publishStatus: 1 });
    if (res.state === 200) {
      ElMessage.success(res.message);
    } else {
      ElMessage.error(res.message);
    }
    proTable.value?.getTableList();
  });
};
</script>
