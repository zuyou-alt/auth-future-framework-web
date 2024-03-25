export namespace Log {
  export interface LoginLog {
    id: String;
    userId: String;
    userAccount: String;
    userName: String;
    userIdentity: String;
    orgId: String;
    orgName: String;
    orgPath: String;
    content: String;
    loginFlag: String;
    loginTime: String;
    logoutTime: String;
    loginType: number;
    terminalType: number;
    terminalInfo: String;
    location: String;
    appId: String;
    tenantId: String;
    remark: String;
    digest: String;
  }

  export interface OperatorLog {
    /**
     * 操作日志ID
     */
    id: String;

    /**
     *登录日志ID
     */
    loginId: String;

    /**
     * 用户ID
     */
    userId: String;

    /**
     * 用户账号
     */
    userAccount: String;

    /**
     * 用户名称
     */
    userName: String;

    /**
     * 用户身份
     */
    userIdentity: String;

    /**
     * 组织ID
     */
    orgId: String;

    /**
     * 机构名称
     */
    orgName: String;

    /**
     * 机构PATH
     */
    orgPath: String;

    /**
     * 日志标题
     */
    title: String;

    /**
     * 日志内容
     */
    content: String;

    /**
     * 业务类型：0其它 1新增 2修改 3删除
     */
    bizType: String;

    /**
     * 业务模块
     */
    bizModel: String;

    /**
     * 记录时间
     */
    recordTime: String;

    /**
     * 操作时间
     */
    operatorTime: String;

    /**
     * 操作目标
     */
    target: String;

    /**
     * 操作结果：0成功，非0失败
     */
    result: String;

    /**
     * 操作发起者
     */
    sender: String;

    /**
     * 请求URL
     */
    requestUrl: String;

    /**
     * 请求参数
     */
    requestParam: String;

    /**
     * 响应结果
     */
    responseResult: String;

    /**
     * 用户IP
     */
    userIp: String;
    /**
     * 应用ID
     */
    appId: String;

    /**
     * 应用名称
     */
    appName: String;

    /**
     * 租户ID
     */
    tenantId: String;

    /**
     * 备注
     */
    remark: String;

    /**
     * 日志摘要
     */
    digest: String;
  }

  export interface PageLoginLogVo {
    userName: String;
    userAccount: String;
    userIdentity: String;
    orgName: String;
    loginStartTime: String;
    loginEndTime: String;
    logoutStartTime: String;
    logoutEndTime: String;
    loginType: String;
    terminalType: String;
    appName: String;
  }
  export interface PageOperatorLogVo {
    userName: String;
    userAccount: String;
    userIdentity: String;
    orgName: String;
    loginStartTime: String;
    loginEndTime: String;
    logoutStartTime: String;
    logoutEndTime: String;
    loginType: String;
    terminalType: String;
    appName: String;
  }
}
