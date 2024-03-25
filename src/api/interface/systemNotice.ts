export namespace Notice {
  export interface NoticeInfo {
    id?: string;
    title?: string;
    type?: number;
    typeArr?: number[];
    publishStatus?: number;
    publishTime?: string;
    topStatus?: number;
    content?: string;
    attachments?: string;
  }
  export interface PageNoticeList {
    title?: string;
    type?: number;
    publishStatus?: number;
    content?: string;
    timeList?: string;
  }
}
