import http from "@/api";
import { PLATFORM } from "@/api/config/servicePort";
import { Org } from "@/api/interface/org";
import qs from "qs";

/**
 * 根据父级ID查询组织子集
 * @param params 父级ID
 * @returns 子集集合
 */
export const getOrgListByParentIdApi = (params: object) => {
  return http.get<Org.OrgInfo[]>(PLATFORM + `/organization/getOrgListByParentId?${qs.stringify(params)}`, { loading: false });
};

/**
 * 保存组织
 * @param params 组织信息
 * @returns 组织ID
 */
export const saveOrganization = (params: Org.OrgInfo) => {
  return http.post<string>(PLATFORM + `/organization/saveOrganization?`, params, { loading: false });
};

/**
 * 根据ID查询组织信息
 * @param params 组织ID
 * @returns 组织信息
 */
export const getOrganization = (params: string) => {
  return http.get<Org.OrgInfo>(PLATFORM + `/organization/getOrganization?id=` + params, { loading: false });
};

/**
 * 根据组织ID删除组织
 * @param params 组织ID
 * @returns 删除结果
 */
export const removeOrganization = (params: string) => {
  return http.get<void>(PLATFORM + `/organization/removeOrganization?id=` + params, { loading: false });
};
