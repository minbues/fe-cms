export interface Pagination {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
}

export interface JWTPayload {
  id: number;
  role: {
    id: number;
    name: string;
  };
  sessionId: number;
  iat: number;
  exp: number;
}
