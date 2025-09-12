export interface AxiosErrorResponse {
  message: string;
  name: string;
  stack: string;
  code: string;
  status: number;
  response: ResponseError;
}

interface ResponseError {
  data: {
    message: string;
    stackTrace: string;
    statusCode: string;
  };
}

export interface IErrorResponse {
  errorCode: string;
  message: string;
  statusCode: number;
}

export interface IPagingResponse<T = unknown> {
  items: T;
  headers: {
    "x-next-page": number;
    "x-page": number;
    "x-pages-count": number;
    "x-per-page": number;
    "x-total-count": number;
  };
}

export type ParamsObject = {
  [key: string]:
    | string
    | number
    | boolean
    | Array<string | number>
    | Date
    | null
    | undefined;
};

export interface IPagingParams extends ParamsObject {
  sort?: string;
  page?: number;
  perPage?: number;
}
