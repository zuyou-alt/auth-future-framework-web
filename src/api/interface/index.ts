// 请求响应参数（不包含data）
export interface Result {
  state: number;
  message: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
  records: [];
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    account: string;
    password: string;
    login_type: number;
    app_key: string;
  }
  export interface ResLogin {
    accessToken: string;
    refreshToken: string;
    expireIn: number;
    loginUser: object;
    type: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams {
    relevancyOrgId?: string;
    relevancyOrgName?: string;
    id?: string;
    account?: string;
    name?: string;
    phone?: string;
    email?: string;
    nickName?: string;
    startTime?: string;
    endTime?: string;
  }
  export interface UserInfo {
    id?: string;
    account?: string;
    password?: string;
    name?: string;
    phone?: string;
    email?: string;
    idCard?: string;
    nickName?: string;
    headPortrait?: string;
    gender?: string;
    birthday?: string;
    region?: string;
    address?: string;
    job?: string;
    userRank?: string;
    intro?: string;
    sourceTo?: number;
    status?: string;
    auditStatus?: string;
    identity?: string;
    identityList?: string[];
    identityStr?: string;
    loginFlag?: string;
    userSort?: number;
    relevancyOrgType?: number;
    relevancyOrgId?: string;
    relevancyOrgName?: string;
    defaultOrgId?: string;
    defaultOrgName?: string;
  }
  export interface ResUserList {
    id: string;
    name: string;
    gender: string;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    organizationId: string;
    organizationName: string;
    status: number;
    headPortrait: string;
    photo: any[];
    account: string;
    phone: string;
    nickName: string;
    job: string;
    userRank: string;
    intro: string;
    sourceTo: number;
    identity: string;
    loginFlag: number;
    userSort: number;
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }

  export interface UserOrgRelation {
    userId?: string;
    userName?: string;
    orgId: string;
    orgName: string;
    type: number;
  }

  export interface SaveUserOrg {
    userId: string;
    orgIds: UserOrgType[];
  }

  export interface UserOrgType {
    orgId: string;
    type: number;
  }

  export interface UpdatePassword {
    password?: string;
    newPassword?: string;
    rePassword?: string;
    userId?: string;
  }
  export interface UpdateIdentity {
    userId: string;
    identityList: string[];
  }
}
