type ErrorResponse = {
  code: number;
  message: string;
  data?: {
    [key: string]: unknown;
  };
};

