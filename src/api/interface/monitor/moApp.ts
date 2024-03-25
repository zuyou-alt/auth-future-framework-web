import { Dict } from "@/api/interface/dict";
export namespace MoApp {
  export interface MoAppInfo {
    id: string;
    appName: string;
    appKey: string;
    appDes: string;
    type: number;
    typeStr: string[];
    remark: string;
    appStatus: string;
    appStatusStr: string[];
    projectId: string;
    projectDataEnum: Dict.DictData[];
  }
  export interface PageMoAppList {
    appName: string;
    appKey: string;
    type: number;
    appStatus: string;
    projectId: string;
  }
}
