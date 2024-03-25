import { ResPage, User } from "@/api/interface/index";
import { PLATFORM, PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import qs from "qs";
/**
 * 根据添加分页查询用户列表
 * @param params 查询条件
 * @returns 用户列表数据
 */
export const pageUserListApi = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.UserInfo[]>>(PLATFORM + `/user/pageUserList`, params);
};

/**
 * 保存用户
 * @param params 用户信息
 * @returns 用户ID
 */
export const saveUser = (params: User.ResUserList) => {
  return http.post(PLATFORM + `/user/saveUser`, params);
};
/**
 * 保存用户基础信息
 * @param params 用户信息
 * @returns 用户ID
 */
export const saveUserBaseInfoApi = (params: User.UserInfo) => {
  return http.post<string>(PLATFORM + `/user/saveUserBaseInfo`, params);
};

/**
 * 批量删除用户
 * @param params 用户ID集合
 * @returns 删除结果
 */
export const removeUsers = (params: string[]) => {
  return http.post(PLATFORM + `/user/removeUsers`, params);
};

/**
 * 重置用户密码
 * @param params 用户ID
 * @returns 重置结果
 */
export const resetUserPassWord = (params: { userId: string }) => {
  return http.get(PLATFORM + `/user/resetPassword`, params);
};

/**
 * 批量重置用户密码
 * @param params 用户ID集合
 * @returns 重置结果
 */

export const batchResetPasswordApi = (params: string[]) => {
  return http.post(PLATFORM + `/user/batchResetPassword`, params);
};

/**
 * 解锁单个用户
 * @param params 用户ID
 * @returns
 */
export const batchUnlockUserApi = (params: string[]) => {
  return http.post(PLATFORM + `/user/batchUnlockUser`, params);
};

/**
 * 更新用户身份信息
 * @param params 用户ID
 * @returns
 */
export const updateUserIdentityApi = (params: User.UpdateIdentity) => {
  return http.post<boolean>(PLATFORM + `/user/updateUserIdentity`, params);
};

/**
 * 根据用户ID获取用户信息
 * @param params 用户ID
 * @returns  用户信息
 */
export const getUserInfoApi = (params: { id: string }) => {
  return http.get<User.UserInfo>(PLATFORM + `/user/getUser?${qs.stringify(params)}`);
};
// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/tree/list`, params);
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(PORT1 + `/user/saveUser`, params);
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(PORT1 + `/user/import`, params);
};

// 编辑用户
export const editUser = (params: { id: string }) => {
  return http.post(PORT1 + `/user/edit`, params);
};

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/user/change`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/user/export`, params);
};

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(PORT1 + `/user/status`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender[]>(PORT1 + `/user/gender`);
};

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<User.ResDepartment[]>(PORT1 + `/user/department`, {}, { cancel: false });
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole[]>(PORT1 + `/user/role`);
};

// 保存用户组织关系
export const saveUserOrgApi = (params: User.SaveUserOrg) => {
  return http.post(PLATFORM + `/userOrg/saveUserOrg`, params);
};

// 保存用户组织关系
export const queryUserOrgListApi = (params: any) => {
  return http.get<User.UserOrgRelation[]>(PLATFORM + `/userOrg/queryUserOrgList?${qs.stringify(params)}`, { loading: false });
};

// 删除用户组织关系
export const removeUserOrgApi = (params: any) => {
  return http.get<boolean>(PLATFORM + `/userOrg/removeUserOrg?${qs.stringify(params)}`, { loading: false });
};

// 用户修改密码
export const updatePwdAPi = (params: User.UpdatePassword) => {
  return http.post<boolean>(PLATFORM + `/user/updatePwd`, params, { loading: false });
};
