import http from "@/api";
import { PLATFORM } from "@/api/config/servicePort";
import { Notice } from "@/api/interface/systemNotice";
import qs from "qs";
/**
 * 分页查询系统通知
 * @param params 查询条件
 * @returns 通知集合
 */
export const pageNoticeListApi = (params: Notice.PageNoticeList) => {
  return http.post<Notice.NoticeInfo[]>(PLATFORM + `/notice/pageNoticeList`, params, { loading: false });
};

/**
 * 保存系统通知
 * @param params 系统通知内容
 * @returns 通知ID
 */
export const saveNoticeApi = (params: Notice.NoticeInfo) => {
  return http.post<string>(PLATFORM + `/notice/saveNotice`, params, { loading: false });
};

/**
 * 根据ID删除通知
 * @param params 通知ID
 * @returns 删除结果
 */
export const removeNoticeApi = (params: string) => {
  return http.get<boolean>(PLATFORM + `/notice/removeNotice?id=` + params, { loading: false });
};

/**
 * 根据ID获取通知详情
 * @param params 通知ID
 * @returns 通知详情
 */
export const getNoticeInfoApi = (params: string) => {
  return http.get<Notice.NoticeInfo>(PLATFORM + `/notice/getNoticeInfo?id=` + params, { loading: false });
};

/**
 * 发布通知
 * @param params 通知ID
 * @returns 通知详情
 */
export const updatePublishStatusApi = (params: object) => {
  return http.get<boolean>(PLATFORM + `/notice/updatePublishStatus?${qs.stringify(params)}`, { loading: false });
};
