export namespace SystemConfig {
  export interface ConfigClassifyInfo {
    /**
     * 主键
     */
    id?: string;
    /**
     * 分类名称
     */

    name?: string;
    /**
     * 父级分类ID
     */
    parentId?: string;

    /**
     * 所属应用ID
     */
    appKey?: string;
    /**
     * 分类类型
     */
    type?: string;
    /**
     * 排序码
     */
    sort?: number;
  }
  export interface ConfigInfo {
    id?: string; // 主键
    classifyId?: string; //配置分类ID
    classifyName?: string; //配置分类名称
    name?: string; //配置名称
    configKey?: string; //配置key
    configEnable?: number; //是否启用;0 启用  1禁用
    configEnableArr?: number[]; //简介，内容过多时，只显示简介
    about?: string; //最新发布的配置内容
    configContent?: string; //发布状态
    publishStatus?: number; //发布状态
    version?: number; //配置版本
    classifyRoot?: string; //配置根分类
    versionId?: string; // 版本ID
    currentFlag?: boolean; // 是否当前版本
    createTime?: string; // 创建时间
    updateTime?: string; // 更新时间
    configDes?: string; // 配置说明
  }
}
