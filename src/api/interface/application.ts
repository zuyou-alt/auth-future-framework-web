export namespace Application {
  export interface ApplicationInfo {
    /**
     * 主键
     */
    id: string;

    /**
     * 应用名称
     */
    appName: string;

    /**
     * 应用标识
     */
    appKey: string;

    /**
     * 应用秘钥
     */
    appSecret: string;

    /**
     * 应用描述
     */
    appDes: string;

    /**
     * 授权类型，多个授权类型用逗号分隔
     */
    authTypes: string;

    /**
     * 授权类型，转为集合
     */
    authTypeList: string[];

    /**
     * 授权范围，多个范围用逗号分隔
     */
    scopes: string;

    /**
     * 授权范围，转为集合
     */
    scopeList: string[];

    /**
     * 回调URI
     */
    redirectUri: string;

    /**
     * 应用有效期开始时间
     */
    beginTime: Date;

    /**
     * 应用有效期结束时间
     */
    endTime: Date;

    /**
     * 0 公共应用   1内部应用 2外部应用
     */
    type: number;

    /**
     * 0 公共应用   1内部应用 2外部应用
     */
    typeStr: string[];

    /**
     * 是否启用(1 正常  2 禁用)
     *
     */
    appStatus: number;
    /**
     * 是否启用配置checkBox使用
     *
     */
    appStatusStr: number[];
  }
  export interface QueryListParams {
    // 应用名称
    appName?: string;
    //应用标识
    appKey?: string;
    //应用类型
    type?: number[];
  }
}
