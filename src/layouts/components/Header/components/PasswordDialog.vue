<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="500px" draggable>
    <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :model="passwordForm">
      <el-form-item label="原始密码" prop="password">
        <el-input v-model="passwordForm.password" placeholder="请输入原始密码" clearable type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" placeholder="请输入新密码" clearable type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="在输入一次" prop="rePassword">
        <el-input v-model="passwordForm.rePassword" placeholder="请再次输入新密码" clearable @blur="rePwdBlur" type="password" show-password></el-input>
      </el-form-item>
    </el-form>
    <span v-if="!checkPwd" style="margin-left: 10px; font-size: 13px; color: red">密码输入不一致</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="reSetPassWord">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { useRouter } from "vue-router";
import { sm3 } from "sm-crypto";
import { ElMessage } from "element-plus";
import { User } from "@/api/interface";
import { updatePwdAPi } from "@/api/modules/user";
import { LOGIN_URL } from "@/config";
import { getConfigContentByConfigKeyApi } from "@/api/modules/systemConfigApi";

const userStore = useUserStore();
const router = useRouter();
const passwordForm = ref<User.UpdatePassword>({});
const rules = reactive({
  password: [{ required: true, message: "请输入原始密码" }],
  newPassword: [{ required: true, message: "请输入新密码" }],
  rePassword: [{ required: true, message: "请再次输入新密码" }]
});

// 获取配置的密码强度策略
const pwdStrength = ref<string>("");
onMounted(async () => {
  let { data } = await getConfigContentByConfigKeyApi({ appKey: import.meta.env.VITE_APP_KEY as string, configKey: "password_level" });
  pwdStrength.value = data;
  console.log("获取到的配置", data);
});
/**
 * 打开弹框
 */
const dialogVisible = ref(false);
const openDialog = () => {
  dialogVisible.value = true;
};

const checkPwd = ref<boolean>(true);
const rePwdBlur = () => {
  checkPwd.value = passwordForm.value.newPassword === passwordForm.value.rePassword;
};

const reSetPassWord = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.rePassword) {
    ElMessage.error("两次新密码输入不一致，请检查！");
    return;
  }
  // pwdComplexityCheck(passwordForm.value.newPassword!);
  // return;
  let subData: User.UpdatePassword = {
    password: sm3(passwordForm.value.password),
    newPassword: sm3(passwordForm.value.newPassword),
    userId: userStore.userInfo.userId!
  };
  let { state } = await updatePwdAPi(subData);
  if (state === 200) {
    userStore.setToken("");
    userStore.setUserInfo({});
    router.replace(LOGIN_URL);
    ElMessage.success("修改成功！请重新登录");
  }
};

/**
 * 密码复杂度校验
 * 这个正则表达式要求密码满足以下条件：
 * 至少包含一个数字 (?=.*[0-9])。
 * 至少包含一个大写字母 (?=.*[A-Z])。
 * 至少包含一个小写字母 (?=.*[a-z])。
 * 至少包含一个特殊字符或下划线 (?=.*[\W_])。
 * 至少包含一个非空格字符 (?=.*[\S])。
 * 密码长度为8到32个字符 {8,32}。
 */
// const pwdComplexityCheck = (pwd: string) => {
//   let regex;
//   if ("1" === pwdStrength.value) {
//     regex = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])(?=.*[\S]).{8,32}$/;
//   }
//   if ("2" === pwdStrength.value) {
//     regex = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])(?=.*[\S]).{8,32}$/;
//   }
//   if ("3" === pwdStrength.value) {
//     regex = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])(?=.*[\S]).{8,32}$/;
//   } else {
//     regex = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])(?=.*[\S]).{8,32}$/;
//   }
//   if ("4" === pwdStrength.value) {
//     regex = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_])(?=.*[\S]).{8,32}$/;
//   } else {
//     // 默认最低强度
//   }

//   console.log("密码校验", regex.test(pwd));
// };
defineExpose({ openDialog });
</script>
