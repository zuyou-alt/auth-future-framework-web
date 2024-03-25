import { Server } from "@/api/interface/monitor/server";
import { PLATFORM } from "@/api/config/servicePort";
import http from "@/api";

/**
 * 分页查询服务器基本信息
 * @param params 服务器基础信息
 * @returns 服务器集合
 */
export const pageServerInfoListApi = (params: Server.ServerInfo) => {
  return http.post<Server.ServerInfo[]>(PLATFORM + `/mo-server/pageServerInfoList`, params);
};

/**
 * 保存服务器信息
 * @param params 服务器基础信息
 * @returns 服务器ID
 */
export const saveServerInfoApi = (params: Server.ServerInfo) => {
  return http.post<string>(PLATFORM + `/mo-server/saveServerInfo`, params);
};

/**
 * 分页查询服务器基本信息
 * @param params 服务器基础信息
 * @returns 服务器集合
 */
export const removeServerInfoApi = (params: string) => {
  return http.get<boolean>(PLATFORM + `/mo-server/removeServerInfo?id=${params}`);
};

/**
 * 连接服务器
 * @param params 服务器ID
 * @returns 连接结果
 */
export const connectServerApi = (params: string) => {
  return http.get<boolean>(PLATFORM + `/mo-server/connectServer?id=${params}`);
};
