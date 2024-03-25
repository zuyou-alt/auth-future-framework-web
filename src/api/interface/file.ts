export namespace File {
  export interface FileInfo {
    id?: string;
    name?: string;
    fileName?: string;
    originalFileName?: string;
    downloadUrl?: string;
    ext?: string;
    url?: string;
    path?: string;
    basePath?: string;
    fileSize?: string;
    filePlatform?: string;
    createBy?: string;
    createTime?: string;
  }
  export interface ImageInfo {
    id: string;
    url: string;
  }
}
