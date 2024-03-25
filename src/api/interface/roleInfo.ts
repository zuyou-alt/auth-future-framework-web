export namespace Role {
  export interface RoleInfo {
    id: string;
    name: string;
    appName: string;
    appId: string;
    roleKey: string;
    remark: string;
    menuIdList?: string[];
    orgList?: string[];
  }
  export interface RequestPage {
    name?: string;
    appId?: string;
    appName?: string;
    roleKey?: string;
  }

  export interface BindRoleInfo {
    roleId: string;
    bindId: string;
    roleIds: string[];
    bindIds: string[];
  }
}
