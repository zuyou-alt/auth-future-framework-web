import { Api } from "@/api/interface/apiInfo";
import { PLATFORM } from "@/api/config/servicePort";
import http from "@/api";

/**
 * 根据条件查询应用列表
 * @param params 查询条件
 * @returns 应用列表
 */
export const pageApiInfo = (params: Api.RequestApiPage) => {
  return http.post<Api.ApiInfo[]>(PLATFORM + `/apiInfo/pageApiInfo`, params);
};

/**
 * 保存接口信息
 * @param params 接口详情
 * @returns 接口ID
 */
export const saveApiInfo = (params: Api.ApiInfo) => {
  return http.post<string>(PLATFORM + `/apiInfo/saveApiInfo`, params);
};

/**
 * 根据ID获取接口信息
 * @param params 接口ID
 * @returns 接口ID
 */
export const getApiInfo = (params: string) => {
  return http.get<string>(PLATFORM + `/apiInfo/getApiInfo?apiId=` + params, {});
};

/**
 * 删除接口
 * @param params 接口ID
 * @returns 接口ID
 */
export const removeApiInfosApi = (params: string[]) => {
  return http.post<string>(PLATFORM + `/apiInfo/removeApiInfos`, params, {});
};
