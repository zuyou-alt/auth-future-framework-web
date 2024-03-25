<template>
  <div class="main-box">
    <div class="table-box">
      <ProTable ref="proTable" row-key="id" :indent="20" :columns="columns" :request-auto="true" :request-api="pageOperatorLogListApi" :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }">
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="Download">导出日志</el-button>
          <el-button type="primary" :icon="Upload">恢复日志</el-button>
          <el-button type="danger" :icon="Delete">删除日志</el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation>
          <el-button type="primary" link :icon="View">查看详情</el-button>
          <el-button type="danger" link :icon="Delete">删除</el-button>
        </template>
      </ProTable>
    </div>
  </div>
</template>
<script setup lang="ts" name="OperatorLogManage">
import { ref, reactive, onMounted } from "vue";
import { ColumnProps, ProTableInstance } from "@/components/ProTable/interface";
import { Log } from "@/api/interface/Log";
import { pageOperatorLogListApi } from "@/api/modules/logApi";
import ProTable from "@/components/ProTable/index.vue";
import { Delete, View, Download, Upload } from "@element-plus/icons-vue";
// 获取 ProTable 实例
const proTable = ref<ProTableInstance>();

// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let userIdentityEnum = ref<Dict.DictData[]>([]);
let bizTypeEnum = ref<Dict.DictData[]>([]);
onMounted(async () => {
  let { data } = await getBatchDict(["biz_type", "user_identity"]);
  bizTypeEnum.value = data.filter(item => item.dictType === "biz_type")[0].dictDataCommonList;
  bizTypeEnum.value.forEach(item => (item.value = parseInt(item.value!)));
  userIdentityEnum.value = data.filter(item => item.dictType === "user_identity")[0].dictDataCommonList;
});

// 表格配置项
const columns = reactive<ColumnProps<Log.LoginLog>[]>([
  { type: "index", label: "序号", width: 80 },
  { prop: "userAccount", label: "登录账号", align: "center", search: { el: "input", props: { placeholder: "请输入用户账号" } } },
  { prop: "userName", label: "用户姓名", align: "center", search: { el: "input", props: { placeholder: "请输入用户名称" } } },
  { prop: "userIdentity", label: "用户身份", align: "center", isShow: false, enum: userIdentityEnum, search: { el: "select", props: { placeholder: "请选择用户身份" } } },
  { prop: "orgName", label: "组织名称", align: "center", isShow: false },
  { prop: "title", label: "日志标题", align: "center", search: { el: "input", props: { placeholder: "请输入日志标题" } } },
  { prop: "content", label: "日志内容", align: "center" },
  { prop: "bizType", label: "业务类型", align: "center", enum: bizTypeEnum },
  { prop: "recordTime", label: "记录时间", align: "center" },
  { prop: "target", label: "操作目标", align: "center" },
  { prop: "location", label: "登录IP", align: "center" },
  { prop: "appKey", label: "应用标识", align: "center", isShow: false, search: { el: "input", props: { placeholder: "请输入应用标识" } } },
  { prop: "operatorTimeList", label: "选择操作时间", isShow: false, align: "center", isHide: true, search: { el: "date-picker", props: { placeholder: "请选择操作开始时间", type: "datetimerange" } } },
  { prop: "operation", label: "操作", width: 200 }
]);
</script>
