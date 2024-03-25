export type LayoutType = "vertical" | "classic" | "transverse" | "columns";

export type AssemblySizeType = "large" | "default" | "small";

export type LanguageType = "zh" | "en" | null;

/* GlobalState */
export interface GlobalState {
  layout: LayoutType;
  assemblySize: AssemblySizeType;
  language: LanguageType;
  maximize: boolean;
  primary: string;
  isDark: boolean;
  isGrey: boolean;
  isWeak: boolean;
  asideInverted: boolean;
  headerInverted: boolean;
  isCollapse: boolean;
  accordion: boolean;
  breadcrumb: boolean;
  breadcrumbIcon: boolean;
  tabs: boolean;
  tabsIcon: boolean;
  footer: boolean;
}

export interface UserInfo {
  /**
   * 登录Id（一般为登录日志Id）
   */
  loginId?: string;

  /**
   * 登录类型
   */
  loginType?: string;

  /**
   * 用户ID
   */
  appId?: string;

  /**
   * 应用名称
   */
  appName?: string;

  /**
   * 应用key
   */
  appKey?: string;

  /**
   *  主键
   */
  userId?: string;

  /**
   * 用户姓名
   */
  userName?: string;
  userPhone?: string;
  userAccount?: string;
  nickName?: string;
  headPortrait?: string;
  gender?: string;
  sourceTo?: number;
  status?: number;
  auditStatus?: number;
  identity?: string;
  identityStr?: string;
  identityList?: UserIdentity[];
  loginFlag?: number;
  userSort?: number;
  orgId?: string;
  orgName?: string;
  orgParentId?: string;
  orgSort?: string;
  orgType?: string;
  orgPath?: string;
  roleIdList?: string[];
  roleKeyList?: string[];
  loginTime?: string;
  expirationTime?: string;
  captcha?: string;
  ipAddr?: string;
  loginLocation?: string;
  userOrgVoList?: UserOrg[];
  browser?: string;
  os?: string;
}

export interface UserIdentity {
  identity: string;
  identityStr: string;
}

export interface UserOrg {
  id?: string;
  userId?: string;
  userName?: string;
  orgId?: string;
  orgName?: string;
  type?: number;
  typeStr?: string;
}

/* UserState */
export interface UserState {
  token: string;
  userInfo: UserInfo;
}

/* tabsMenuProps */
export interface TabsMenuProps {
  icon: string;
  title: string;
  path: string;
  name: string;
  close: boolean;
  isKeepAlive: boolean;
}

/* TabsState */
export interface TabsState {
  tabsMenuList: TabsMenuProps[];
}

/* AuthState */
export interface AuthState {
  routeName: string;
  authButtonList: {
    [key: string]: string[];
  };
  authMenuList: Menu.MenuOptions[];
}

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[];
}
