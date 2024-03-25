import { MoApp } from "@/api/interface/monitor/moApp";
import { PLATFORM } from "@/api/config/servicePort";
import http from "@/api";

/**
 * 保存应用信息
 * @param params 应用基础信息
 * @returns 项目ID
 */
export const saveAppInfoApi = (params: MoApp.MoAppInfo) => {
  return http.post<string>(PLATFORM + `/mo-app/saveAppInfo`, params);
};

/**
 * 根据ID查询应用信息
 * @param params 应用ID
 * @returns 应用基础信息
 */
export const getApplicationInfoApi = (params: string) => {
  return http.post<MoApp.MoAppInfo>(PLATFORM + `/mo-app/getApplicationInfo?id=${params}`);
};

/**
 * 根据ID删除应用信息
 * @param params 应用ID
 * @returns 删除结果
 */
export const removeAppInfoByIdApi = (params: string) => {
  return http.post<boolean>(PLATFORM + `/mo-app/removeAppInfoById?id=${params}`);
};

/**
 * 分页查询应用信息
 * @param params 查询条件
 * @returns 应用集合
 */
export const pageAppListApi = (params: MoApp.PageMoAppList) => {
  return http.post<MoApp.MoAppInfo[]>(PLATFORM + `/mo-app/pageAppList`, params);
};
