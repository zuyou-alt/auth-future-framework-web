import http from "@/api";
import { PLATFORM } from "@/api/config/servicePort";
import { Dict } from "@/api/interface/dict";
import qs from "qs";

/**
 * 根据父级ID查询字典分类子集
 * @param params 父级ID
 * @returns 子集集合
 */
export const getDictTypeListByParentId = (params: object) => {
  return http.get<Dict.DictType[]>(PLATFORM + `/dict/getDictTypeListByParentId?${qs.stringify(params)}`, { loading: false });
};

/**
 * 根据ID查询字典分类信息
 * @param params 主键ID
 * @returns 字典分类信息
 */
export const getDictTypeInfo = (params: string) => {
  return http.get<Dict.DictType>(PLATFORM + `/dict/getDictTypeInfo?id=` + params, { loading: false });
};

/**
 * 保存数据字典分类
 * @param params 分类ID
 * @returns 分类主键
 */
export const saveDictType = (params: Dict.DictType) => {
  return http.post<string>(PLATFORM + `/dict/saveDictType`, params, { loading: false });
};

/**
 * 根据ID删除字典分类
 * @param params 分类ID
 * @returns 分类主键
 */
export const removeDictType = (params: string) => {
  return http.get<boolean>(PLATFORM + `/dict/removeDictType?id=` + params, { loading: false });
};

/**
 * 根据字典类型获取字典列表
 * @param params 分类ID
 * @returns 分类主键
 */
export const getDictDataListByDictType = (params: string) => {
  return http.get<boolean>(PLATFORM + `/dict/getDictDataListByDictType?${qs.stringify(params)}`, { loading: false });
};

/**
 * 保存字典数据
 * @param params 字典数据
 * @returns 字典主键
 */
export const saveDictData = (params: string) => {
  return http.post<boolean>(PLATFORM + `/dict/saveDictData`, params, { loading: false });
};

/**
 * 删除数据字典
 * @param params 字典数据
 * @returns 字典主键
 */
export const removeDictData = (params: string) => {
  return http.get<boolean>(PLATFORM + `/dict/removeDictData?id=` + params, { loading: false });
};

/**
 * 批量删除数据字典
 * @param params 数据字典ID集合
 * @returns 字典主键
 */
export const removeBatchDictData = (params: string[]) => {
  return http.post<boolean>(PLATFORM + `/dict/removeBatchDictData`, params, { loading: false });
};

/**
 * 根据字典类型获取数据字典
 * @param params 数据字典ID集合
 * @returns 字典主键
 */
export const getDict = (params: string) => {
  return http.get<Dict.DictData[]>(PLATFORM + `/dict/getDict?dictType=` + params, { loading: false });
};

/**
 * 根据字典类型获取数据字典
 * @param params 数据字典ID集合
 * @returns 字典主键
 */
export const getBatchDict = (params: string[]) => {
  return http.post<Dict.BatchDict[]>(PLATFORM + `/dict/getBatchDict`, params, { loading: false });
};
