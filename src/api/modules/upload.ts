import { Upload } from "@/api/interface/index";
import { PLATFORM } from "@/api/config/servicePort";
import http from "@/api";
import { File } from "@/api/interface/file";
import qs from "qs";

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PLATFORM + `/file/uploadFile`, params, { cancel: false });
};

/**
 * @name 文件上传接口
 */
// 文件上传
export const uploadFileApi = (params: FormData) => {
  return http.post<File.FileInfo>(PLATFORM + `/file/uploadFile`, params, { cancel: false });
};

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PLATFORM + `/file/upload/video`, params, { cancel: false });
};

/**
 * 根据文件ID查询文件列表
 * @param params  文件ID： 格式 1,2,2,2
 * @returns 文件列表
 */
export const queryFileListByIdApi = (params: string) => {
  return http.get<File.FileInfo[]>(PLATFORM + `/file/queryFileListById?id=` + params, { cancel: false });
};

/**
 * 根据文件ID删除文件
 * @param params id：文件ID removeFile: 是否删除真实文件
 * @returns 删除状态
 */
export const removeFileInfoApi = (params: object) => {
  return http.get<boolean>(PLATFORM + `/file/removeFileInfo?${qs.stringify(params)}`, { cancel: false });
};

/**
 * 文件下载
 * @param params id：文件ID removeFile: 是否删除真实文件
 * @returns 删除状态
 */
export const downloadFileApi = (params: object) => {
  return http.get<void>(PLATFORM + `/file/downloadFile?${qs.stringify(params)}`, { cancel: false });
};

/**
 *
 * @param params 根据ID获取文件信息
 * @returns 文件信息
 */
export const getFileInfoApi = (params: object) => {
  return http.get<File.FileInfo>(PLATFORM + `/file/getFileInfo?${qs.stringify(params)}`, { cancel: false });
};
