import { PropsWithChildren } from 'react';
import { ErrorIcon } from './ErrorIcon';

export const ErrorMessage = ({ children }: PropsWithChildren<{}>) => {
  if (!children) {
    return null;
  }

  return (
    <div className="flex items-center font-medium tracking-wide text-red-500 text-xs">
      <ErrorIcon />
      {children}
    </div>
  );
};
