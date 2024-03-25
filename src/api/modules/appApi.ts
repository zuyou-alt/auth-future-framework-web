import { Application } from "@/api/interface/application";
import { PLATFORM } from "@/api/config/servicePort";
import http from "@/api";

/**
 * 根据条件查询应用列表
 * @param params 查询条件
 * @returns 应用列表
 */
export const queryApplicationList = (params: Application.QueryListParams) => {
  return http.post<Application.ApplicationInfo[]>(PLATFORM + `/app/queryApplicationList`, params);
};

/**
 * 根据条件查询应用列表
 * @param params 查询条件
 * @returns 应用列表
 */
export const saveApplication = (params: Application.ApplicationInfo) => {
  return http.post<string>(PLATFORM + `/app/saveApplication`, params);
};

/**
 * 根据条件查询应用列表
 * @param params 查询条件
 * @returns 应用列表
 */
export const pageApplicationList = (params: Application.ApplicationInfo) => {
  return http.post<string>(PLATFORM + `/app/pageApplicationList`, params);
};

export const removeApplicationApi = (params: string) => {
  return http.get<string>(PLATFORM + `/app/removeApplication?appId=` + params);
};
