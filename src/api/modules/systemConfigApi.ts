import http from "@/api";
import { PLATFORM } from "@/api/config/servicePort";
import { SystemConfig } from "@/api/interface/systemConfig";
import qs from "qs";

/**
 * 根据父级ID查询组织子集
 * @param params 父级ID
 * @returns 子集集合
 */
export const queryConfigClassifyListByParentIdApi = (params: object) => {
  return http.get<SystemConfig.ConfigClassifyInfo[]>(PLATFORM + `/configClassify/queryConfigClassifyListByParentId?${qs.stringify(params)}`, { loading: false });
};

/**
 * 保存配置分类
 * @param params 配置分类详情
 * @returns 分类ID
 */
export const saveConfigClassifyApi = (params: SystemConfig.ConfigClassifyInfo) => {
  return http.post<string>(PLATFORM + `/configClassify/saveConfigClassify`, params, { loading: false });
};

/**
 * 保存配置分类
 * @param params 配置分类详情
 * @returns 分类ID
 */
export const removeConfigClassifyApi = (params: string) => {
  return http.get<boolean>(PLATFORM + `/configClassify/removeConfigClassify?configClassifyId=` + params, { loading: false });
};

/**
 * 根据ID获取配置分类详情
 * @param params 分类ID
 * @returns 分类详细信息
 */
export const getConfigClassifyInfoApi = (params: object) => {
  return http.get<SystemConfig.ConfigClassifyInfo[]>(PLATFORM + `/configClassify/getConfigClassifyInfo?${qs.stringify(params)}`, { loading: false });
};

/**
 * 根据分类查询分类下的配置
 * @param params 分类ID
 * @returns 配置集合
 */
export const queryConfigInfoListByConfigClassifyId = (params: string) => {
  return http.get<SystemConfig.ConfigInfo[]>(PLATFORM + `/configInfo/queryConfigInfoListByConfigClassifyId?${qs.stringify(params)}`, { loading: false });
};

/**
 * 根据分类查询分类下的配置
 * @param params 分类ID
 * @returns 配置集合
 */
export const saveConfigInfoApi = (params: SystemConfig.ConfigInfo) => {
  return http.post<string>(PLATFORM + `/configInfo/saveConfigInfo`, params, { loading: false });
};

/**
 * 批量删除配置
 * @param params 配置ID集合
 * @returns 配置集合
 */
export const removeBatchConfigInfoApi = (params: string[]) => {
  return http.post<boolean>(PLATFORM + `/configInfo/removeBatchConfigInfo`, params, { loading: false });
};

/**
 * 批量删除配置
 * @param params 配置ID集合
 * @returns 配置集合
 */
export const removeConfigInfoApi = (params: string) => {
  return http.get<boolean>(PLATFORM + `/configInfo/removeConfigInfo?configId=` + params, { loading: false });
};

/**
 * 获取配置的历史版本信息
 * @param params 配置ID
 * @returns 配置集合
 */
export const getConfigHistoryVersionApi = (params: string) => {
  return http.get<SystemConfig.ConfigInfo[]>(PLATFORM + `/configInfo/getConfigHistoryVersion?configId=` + params, { loading: false });
};

/**
 * 发布配置
 * @param params 配置ID
 * @returns 发布结果
 */
export const publishConfigApi = (params: string) => {
  return http.get<boolean>(PLATFORM + `/configInfo/publishConfig?configId=` + params, { loading: false });
};

/**
 * 删除历史版本
 * @param params 配置ID
 * @returns 发布结果
 */
export const removeHisVersionApi = (params: string) => {
  return http.get<boolean>(PLATFORM + `/configInfo/removeHisVersion?id=` + params, { loading: false });
};

/**
 * 根据应用key和配置标识获取配置内容
 * @param params 配置ID
 * @returns 发布结果
 */
export const getConfigContentByConfigKeyApi = (params: any) => {
  return http.get<any>(PLATFORM + `/configInfo/getConfigContentByConfigKey?${qs.stringify(params)}`, { loading: false });
};
