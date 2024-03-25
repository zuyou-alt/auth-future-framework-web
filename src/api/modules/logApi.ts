import { Log } from "@/api/interface/Log";
import { PLATFORM } from "@/api/config/servicePort";
import http from "@/api";

/**
 * 分页查询登录日志
 * @param params 查询条件
 * @returns 日志集合
 */
export const pageLoginLogListApi = (params: Log.PageLoginLogVo) => {
  return http.post<Log.LoginLog[]>(PLATFORM + `/log/pageLoginLogList`, params);
};

/**
 * 分页查询操作日志
 * @param params 查询条件
 * @returns 日志集合
 */
export const pageOperatorLogListApi = (params: Log.PageOperatorLogVo) => {
  return http.post<Log.OperatorLog[]>(PLATFORM + `/log/pageOperatorLogList`, params);
};
