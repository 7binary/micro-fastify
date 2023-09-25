import { PropsWithChildren } from 'react';

interface Props {
  title?: string;
  subtitle?: string;
}

export const AuthBox = ({ children, title, subtitle }: PropsWithChildren<Props>) => (
  <div className="-mx-4 flex flex-wrap">
    <div className="w-full px-4">
      <div className="mx-auto max-w-[500px] rounded-md bg-primary bg-opacity-5 py-5 px-16 dark:bg-dark">
        {title ? (
          <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
            {title}
          </h3>
        ) : null}
        {subtitle ? (
          <p className="mb-5 text-center text-base font-medium text-body-color">
            It’s totally free and super easy
          </p>
        ) : null}
        {children}
      </div>
    </div>
  </div>
);
