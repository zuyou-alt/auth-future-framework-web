<template>
  <el-dialog v-model="dialogVisible" title="个人信息" width="800px" draggable :close-on-click-modal="false">
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :model="userInfoForm">
      <el-row>
        <el-col :span="10">
          <el-form-item label="用户头像" prop="headPortrait">
            <UploadImg v-model:image-info="headerImage" width="135px" height="135px" :file-size="3">
              <template #empty>
                <el-icon><Avatar /></el-icon>
                <span>请上传头像</span>
              </template>
              <template #tip> 头像大小不能超过 3M </template>
            </UploadImg>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="用户账号" prop="account">
            <el-input v-model="userInfoForm.account" placeholder="请填写用户账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="userInfoForm.name" placeholder="请填写用户姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户电话" prop="phone">
            <el-input v-model="userInfoForm.phone" placeholder="请填写用户电话" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属组织" prop="relevancyOrgName">
            <el-input v-model="userInfoForm.defaultOrgName" placeholder="请填写所属组织" disabled clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="userInfoForm.gender" placeholder="请选择性别" clearable style="width: 100%">
              <el-option v-for="item in userGenderEnum" :key="item.value" :label="item.label" :value="item.value!" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="userInfoForm.idCard" placeholder="请填写身份证号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfoForm.email" placeholder="请填写邮箱" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户职务" prop="job">
            <el-input v-model="userInfoForm.job" placeholder="请填写用户职务" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户职称" prop="userRank">
            <el-input v-model="userInfoForm.userRank" placeholder="请填写用户职称" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="居住地址" prop="address">
            <el-input v-model="userInfoForm.address" type="textarea" rows="2" placeholder="请填写居住地址" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUserInfo">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { User } from "@/api/interface";
import { getUserInfoApi, saveUserBaseInfoApi } from "@/api/modules/user";
import { useUserStore } from "@/stores/modules/user";
import { File } from "@/api/interface/file";
import UploadImg from "@/components/Upload/Img.vue";
import { ElMessage } from "element-plus";
const userStore = useUserStore();
const dialogVisible = ref(false);
const userInfoForm = ref<User.UserInfo>({});
const openDialog = async () => {
  // 获取用户信息
  let { data } = await getUserInfoApi({ id: userStore.userInfo.userId! });
  console.log(data);
  userInfoForm.value = data;
  setFileInfo();
  getDictData();

  dialogVisible.value = true;
};

// 获取数据字典信息
import { Dict } from "@/api/interface/dict";
import { getBatchDict } from "@/api/modules/dictApi";
let userIdentityEnum = ref<Dict.DictData[]>([]);
let userGenderEnum = ref<Dict.DictData[]>([]);
let userStatusEnum = ref<Dict.DictData[]>([]);
let headerImage = ref<File.FileInfo>({});
const getDictData = async () => {
  let { data } = await getBatchDict(["user_identity", "user_gender", "user_status"]);
  userIdentityEnum.value = data.filter(item => item.dictType === "user_identity")[0]!.dictDataCommonList;
  userGenderEnum.value = data.filter(item => item.dictType === "user_gender")[0]!.dictDataCommonList;
  userStatusEnum.value = data.filter(item => item.dictType === "user_status")[0].dictDataCommonList;
  userStatusEnum.value.forEach(item => (item.value = parseInt(item.value!)));
};

const rules = reactive({
  avatar: [{ required: true, message: "请上传用户头像" }],
  name: [{ required: true, message: "请填写用户姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  organizationName: [{ required: true, message: "请选择用户所属组织" }],
  phone: [{ required: true, message: "请填写电话号码" }],
  account: [{ required: true, message: "请填写邮箱" }],
  identity: [{ required: true, message: "请选择用户身份" }]
});

import { getFileInfoApi } from "@/api/modules/upload";
const setFileInfo = async () => {
  let { data: fileData } = await getFileInfoApi({ id: userInfoForm.value.headPortrait! });
  headerImage.value = fileData;
};

const saveUserInfo = async () => {
  userInfoForm.value.headPortrait = headerImage.value.id!;
  let { state } = await saveUserBaseInfoApi(userInfoForm.value);
  if (state === 200) {
    ElMessage.success("用户信息更新成功!");
    dialogVisible.value = false;
  } else {
    ElMessage.error("用户信息更新失败!");
  }
};
defineExpose({ openDialog });
</script>
