<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :disabled="drawerProps.isView" :model="drawerProps.row" :hide-required-asterisk="drawerProps.isView">
      <el-form-item label="用户头像" prop="headPortrait">
        <UploadImg v-model:image-info="headerImage" width="135px" height="135px" :file-size="3">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请上传头像</span>
          </template>
          <template #tip> 头像大小不能超过 3M </template>
        </UploadImg>
      </el-form-item>
      <el-form-item label="用户账号" prop="account">
        <el-input v-model="drawerProps.row!.account" placeholder="请填写用户账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写用户姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="drawerProps.row!.gender" placeholder="请选择性别" clearable>
          <el-option v-for="item in userGenderEnum" :key="item.value" :label="item.label" :value="item.value!" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select v-model="drawerProps.row!.status" placeholder="请选择用户状态" clearable>
          <el-option v-for="item in userStatusEnum" :key="item.value" :label="item.label" :value="item.value!" />
        </el-select>
      </el-form-item>
      <!-- 用户身份不在添加用户时指定，后台默认指定为普通用户，如果要其他身份，需要安全保密员修改 -->
      <!-- <el-form-item label="用户身份" prop="identity">
        <el-select v-model="drawerProps.row!.identity" placeholder="请选择用户身份" clearable>
          <el-option v-for="item in userIdentityEnum" :key="item.value" :label="item.label" :value="item.value!" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="用户电话" prop="phone">
        <el-input v-model="drawerProps.row!.phone" placeholder="请填写用户电话" clearable></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="drawerProps.row!.idCard" placeholder="请填写身份证号" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户排序" prop="userSort">
        <el-input-number v-model="drawerProps.row!.userSort" :min="1" :max="100000" style="width: 100%" />
      </el-form-item>
      <el-form-item label="所属组织" prop="relevancyOrgName">
        <el-input v-model="drawerProps.row!.relevancyOrgName" placeholder="请填写所属组织" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户职务" prop="job">
        <el-input v-model="drawerProps.row!.job" placeholder="请填写用户职务" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户职称" prop="userRank">
        <el-input v-model="drawerProps.row!.userRank" placeholder="请填写用户职称" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请填写邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="居住地址" prop="address">
        <el-input v-model="drawerProps.row!.address" placeholder="请填写居住地址" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";
import { getFileInfoApi } from "@/api/modules/upload";
import UploadImg from "@/components/Upload/Img.vue";
import { File } from "@/api/interface/file";
const rules = reactive({
  avatar: [{ required: true, message: "请上传用户头像" }],
  name: [{ required: true, message: "请填写用户姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  organizationName: [{ required: true, message: "请选择用户所属组织" }],
  phone: [{ required: true, message: "请填写电话号码" }],
  account: [{ required: true, message: "请填写邮箱" }],
  identity: [{ required: true, message: "请选择用户身份" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.UserInfo>;
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
let userIdentityEnum = ref<Dict.DictData[]>([]);
let userGenderEnum = ref<Dict.DictData[]>([]);
let headerImage = ref<File.FileInfo>({});
let userStatusEnum = ref<Dict.DictData[]>([]);
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  console.log("参数", drawerProps.value.row);
  drawerVisible.value = true;
  if (params.row.id) {
    let { data: fileData } = await getFileInfoApi({ id: params.row.headPortrait! });
    headerImage.value = fileData;
  }
  let { data } = await getBatchDict(["user_identity", "user_gender", "user_status"]);
  userIdentityEnum.value = data.filter(item => item.dictType === "user_identity")[0]!.dictDataCommonList;
  userGenderEnum.value = data.filter(item => item.dictType === "user_gender")[0]!.dictDataCommonList;
  userStatusEnum.value = data.filter(item => item.dictType === "user_status")[0].dictDataCommonList;
  userStatusEnum.value.forEach(item => (item.value = parseInt(item.value!)));
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      drawerProps.value.row.headPortrait = headerImage.value.id;
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
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
