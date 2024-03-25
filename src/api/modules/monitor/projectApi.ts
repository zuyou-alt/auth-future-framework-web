import { Project } from "@/api/interface/monitor/project";
import { ResPage } from "@/api/interface/index";
import { PLATFORM } from "@/api/config/servicePort";
import http from "@/api";

/**
 * 保存项目信息
 * @param params 项目基础信息
 * @returns 项目ID
 */
export const saveProjectApi = (params: Project.ProjectInfo) => {
  return http.post<string>(PLATFORM + `/mo-project/saveProject`, params);
};

/**
 * 根据ID获取项目信息
 * @param params 项目ID
 * @returns 项目ID
 */
export const getProjectInfoApi = (params: string) => {
  return http.get<Project.ProjectInfo>(PLATFORM + `/mo-project/getProjectInfo?id=${params}`);
};

/**
 * 根据ID删除项目信息
 * @param params 项目ID
 * @returns 删除结果
 */
export const removeProjectApi = (params: string) => {
  return http.get<boolean>(PLATFORM + `/mo-project/removeProject?id=${params}`);
};

/**
 * 分页查询项目信息
 * @param params 项目名称
 * @returns 项目集合
 */
export const pageProjectListApi = (params: object) => {
  return http.post<ResPage<Project.ProjectInfo[]>>(PLATFORM + `/mo-project/pageProjectList`, params);
};

/**
 * 查询应用项目组合树
 * @param params 项目名称
 * @returns 项目集合
 */
export const queryMoProjectAppTreeListApi = (params: undefined) => {
  return http.get<Project.MoProjectAppTree[]>(PLATFORM + `/mo-project/queryMoProjectAppTreeList`, params);
};
