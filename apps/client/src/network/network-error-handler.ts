import { isAxiosError, AxiosError } from 'axios';
import { UseFormSetError } from 'react-hook-form/dist/types/form';

interface ErrorObject {
  statusCode: number;
  error: string;
  message: string;
  validation?: Record<string, string>;
  stack?: string;
}

export const networkErrorHandler = (
  err: AxiosError | Error,
  setError: UseFormSetError<any>
): string | undefined => {
  if (!isAxiosError(err)) {
    return err.message || err.toString();
  }

  if (!err.response && err.request) {
    return 'Something is wrong with your network. Please check your connection and try again later';
  }

  const validation = err.response?.data?.validation as Record<string, string>;
  if (typeof validation === 'object' && validation !== null) {
    for (const [errorField, errorMessage] of Object.entries(validation)) {
      setError(errorField, { type: 'server', message: errorMessage });
    }

    return;
  }

  return err.response?.data?.message || err.message || err.toString();
};

export const axiosErrorToString = (err: AxiosError | Error): string => {
  if (!isAxiosError(err)) {
    return err.message || err.toString();
  }

  let message: string;

  if (err.response) {
    const errorData = err.response.data as ErrorObject;
    message = errorData.message || errorData.error || err.toString();
  } else if (err.request) {
    // The request was made but no response was received
    message = 'Something is wrong with your network.'
      + ' Please check your connection and try again later.';
  } else {
    // Something happened in setting up the request that triggered an Error
    message = err.message || err.toString();
  }

  return message;
};
