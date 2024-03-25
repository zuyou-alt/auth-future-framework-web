export namespace Dict {
  export interface DictType {
    id?: string;
    name?: string;
    type?: string;
    status?: number;
    dictSort?: number;
    parentId?: string;
    remark?: string;
    typeLevel?: number;
  }
  export interface DictData {
    id?: string;
    label?: string;
    value?: any;
    tagType?: string;
    dictStatus?: number;
    dictStatusArr?: number[];
    dictTypeId?: string;
    dictSort?: number;
  }

  export interface BatchDict {
    dictType: string;
    dictDataCommonList: Dict.DictData[];
  }
}
