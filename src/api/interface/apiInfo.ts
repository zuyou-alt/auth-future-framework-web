export namespace Api {
  export interface ApiInfo {
    /**
     * 主键
     */
    id: string;

    /**
     * 接口名称
     */
    name: string;

    /**
     * 接口路径
     */
    pattern: string;

    /**
     * 接口前缀
     */
    patternPre: string;

    /**
     * 接口模块名称
     */
    modelName: string;

    /**
     * 接口所属服务
     */
    appId: string;
    /**
     * 接口方法
     */
    apiMethod: string;
    /**
     * 接口应用名称
     */
    appName: string;

    apiIds?: string[];

    roleIds?: string[];
  }
  export interface RequestApiPage {
    /**
     * 接口所属应用
     */
    appId?: string;
    /**
     * 接口应用名称
     */
    appName?: string;
  }
}
