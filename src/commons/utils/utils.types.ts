export type Nullable<T> = T | null;

export type IValidateString = 'char' | 'numeric' | 'encode' | 'decode';

export type IValidateReplacePhone = '08' | '62';

export type IValidateRandomChar = 'alpha' | 'numeric' | 'alphanumeric';

export type IValidatePaginationSort = 'ASC' | 'DESC';

export type IPagination = {
  page: number;
  limit: number;
  skip?: number;
  status?: number;
  orderBy?: string;
  sort?: IValidatePaginationSort;
  sortCondition?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export type IPaginationMeta = {
  limit?: number;
  page?: number;
  getMore?: boolean;
  totalData?: number;
  totalPage?: number;
  totalPerPage?: number;
};

export type IPaginationResponse<T> = {
  items: T[];
  meta: IPaginationMeta;
};

export type IUser = {
  id: number;
  uuid?: string;
  name: string;
  iat: number;
  exp: number;
};

export type MutationResponse = {
  message: string;
  [key: string]: unknown;
};
