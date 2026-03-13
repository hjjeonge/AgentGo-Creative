/** 단일 자원 res */
export interface DataRes<T> {
  data: T;
}

/** 페이지네이션 res */
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/** 목록 res */
export interface ListRes<T> {
  data: T[];
  pagination: Pagination | null;
}

/** 공통 에러 */
export interface CommonError {
  code: string;
  message: string;
  detail: string;
}
