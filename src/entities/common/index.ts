export type DefaultResponse<T> = {
  datetime: string;
  message: string;
  status: number;
  total: number;
  value: T;
};
