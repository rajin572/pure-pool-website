// Response envelope of the Pure Pool backend (see project-docs/04-architecture/system-architecture.md).

export interface IListMeta {
  page: number;
  limit: number;
  total: number;
  /** Tab totals on some lists (invoices, quotes, …). */
  counts?: Record<string, number>;
}

export interface IApiResponse<T> {
  success: true;
  data: T;
  meta?: IListMeta;
}

export interface IApiErrorBody {
  success: false;
  error: {
    code?: string;
    message: string;
  };
}

export type IApiResult<T> = IApiResponse<T> | IApiErrorBody;

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType?: "Bearer";
}

/** `POST /uploads` result item. `url` is absolute (Cloudinary) or `/uploads/…` (local storage). */
export interface IUploadedFile {
  url: string;
  mimeType: string;
  size: number;
}
