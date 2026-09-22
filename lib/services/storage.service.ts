export type UploadResult = {
  url: string;
  path: string;
};

export const storageService = {
  async uploadFile(file: File, bucket: string, path: string): Promise<UploadResult> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      url: `/uploads/${path}/${file.name}`,
      path: `${path}/${file.name}`,
    };
  },

  async deleteFile(bucket: string, path: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  async getFileUrl(bucket: string, path: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return `/uploads/${path}`;
  },
};
