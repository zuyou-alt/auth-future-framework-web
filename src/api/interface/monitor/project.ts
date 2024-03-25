export namespace Project {
  export interface ProjectInfo {
    id?: string;
    name?: string;
  }
  export interface MoProjectAppTree {
    id: string;
    name: string;
    projectId: string;
    type: string;
  }
}
