export namespace Menu {
  export interface MenuInfo {
    createTime?: string;
    createBy?: string;
    updateTime?: string;
    updateBy?: string;
    id?: string;
    menuName?: string;
    menuCode?: string;
    menuType?: string;
    menuIcon?: string;
    menuUrl?: string;
    menuComponent?: string;
    menuShow?: string;
    menuStatus?: string;
    menuSort?: number;
    menuParentId: string;
    menuParentName?: string;
    menuOutside?: string;
    menuAuth?: string;
    menuIdentity?: string;
    path?: string;
    menuTitle?: string;
    menuPath?: string;
    menuIdentityList?: string[];
  }
}
