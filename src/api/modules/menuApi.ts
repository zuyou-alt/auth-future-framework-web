import http from "@/api";
import { PLATFORM } from "@/api/config/servicePort";
import { Menu } from "@/api/interface/menu";

/**
 * 根据父级ID查询菜单子集
 * @param params 菜单父级ID
 * @returns 菜单子集集合
 */
export const queryMenuListParentIdApi = (params: string) => {
  return http.get<Menu.MenuInfo[]>(PLATFORM + `/menu/queryMenuListParentId?parentId=` + params, { loading: false });
};

/**
 * 获取所有菜单
 * @returns 获取菜单树
 */
export const queryMenuAllListTreeApi = () => {
  return http.get<Menu.MenuInfo[]>(PLATFORM + `/menu/queryMenuAllListTree`, { loading: false });
};

/**
 * 保存（新增/修改）菜单
 * @param params 菜单信息
 * @returns 菜单ID
 */
export const saveMuneInfoApi = (params: Menu.MenuInfo) => {
  return http.post<string>(PLATFORM + `/menu/saveMenuInfo`, params, { loading: true });
};

/**
 * 根据ID获取菜单详情
 * @param params 菜单ID
 * @returns 菜单信息
 */
export const getMenuInfoApi = (id: string) => {
  return http.get<Menu.MenuInfo>(PLATFORM + `/menu/getMenuInfo?id=` + id, { loading: false });
};

/**
 * 根据ID删除菜单
 * @param params 菜单ID
 * @returns 菜单信息
 */
export const removeMenuInfoApi = (id: string) => {
  return http.get<string>(PLATFORM + `/menu/removeMenuInfo?id=` + id, { loading: false });
};
