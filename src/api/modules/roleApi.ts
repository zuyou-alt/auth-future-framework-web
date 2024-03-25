import { Role } from "@/api/interface/roleInfo";
import { Menu } from "@/api/interface/menu";
import { Org } from "@/api/interface/org";
import { PLATFORM } from "@/api/config/servicePort";
import http from "@/api";

/**
 * 根据添加分页查询用户列表
 * @param params 查询条件
 * @returns 角色列表数据
 */
export const pageRoleListApi = (params: Role.RequestPage) => {
  return http.post<Role.RoleInfo[]>(PLATFORM + `/role/pageRoleList`, params);
};
/**
 * 保存角色
 * @param params 角色信息
 * @returns 角色ID
 */
export const saveRoleApi = (params: Role.RoleInfo) => {
  return http.post<string>(PLATFORM + `/role/saveRole`, params);
};

/**
 * 根据角色ID删除角色
 * @param params 角色ID
 * @returns 删除结果
 */
export const removeRoleApi = (params: string) => {
  return http.get<boolean>(PLATFORM + `/role/removeRole?id=` + params);
};

/**
 * 根据角色ID查询角色下绑定的菜单资源
 * @param params 角色ID
 * @returns  菜单集合
 */
export const getMenuListByRoleIdApi = (params: string) => {
  return http.get<Menu.MenuInfo[]>(PLATFORM + `/roleBind/getMenuListByRoleId?roleId=` + params);
};

/**
 * 根据角色ID查询角色下绑定的菜单资源
 * @param params 角色ID
 * @returns  菜单集合
 */
export const getOrgListByRoleIdApi = (params: string) => {
  return http.get<Org.OrgInfo[]>(PLATFORM + `/roleBind/getOrgListByRoleId?roleId=` + params);
};

/**
 * 角色绑定资源
 * @param params 角色ID
 * @returns  菜单集合
 */
export const saveRoleBindApi = (params: Role.BindRoleInfo) => {
  return http.post<string>(PLATFORM + `/roleBind/saveRoleBind`, params);
};

export const saveRoleBindUserApi = (params: any) => {
  return http.post<boolean>(PLATFORM + `/roleBind/saveRoleBindUser`, params);
};

/**
 * 资源绑定角色
 * @param params 角色ID
 * @returns  菜单集合
 */
export const saveBindRoleApi = (params: Role.BindRoleInfo) => {
  return http.post<string>(PLATFORM + `/roleBind/saveBindRole`, params);
};

/**
 * 根据角色ID查询该角色下绑定的资源
 * @param params 角色ID
 * @returns  资源集合
 */
export const getApiListByRoleIdApi = (params: string) => {
  return http.get<string>(PLATFORM + `/roleBind/getApiListByRoleId?roleId=` + params);
};

/**
 * 根据资源ID查询该资源绑定的角色
 * @param params 角色ID
 * @returns  菜单集合
 */
export const queryRoleListByBindApi = (params: string) => {
  return http.get<Role.RoleInfo[]>(PLATFORM + `/roleBind/queryRoleListByBind?bindId=` + params);
};
