export type LegacyCommonResponse<T> = {
  status: number;
  value: T;
  total: number;
  cursor: string;
  backCursor: string;
  datetime: string;
  message?: string;
};

export type LegacyFullTimestamp = {
  createdAt: number;
  createdID: string;
  createdIP: string;
  createdBy: string;
  updatedAt: number;
  updatedID: string;
  updatedIP: string;
  updatedBy: string;
};
