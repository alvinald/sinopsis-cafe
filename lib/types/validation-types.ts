export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
};

export type ValidationError = ApiError & {
  errors: {
    field: string;
    message: string;
  }[];
};
