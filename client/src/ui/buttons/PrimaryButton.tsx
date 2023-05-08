import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import cx from 'classnames';

export const PrimaryButton = ({
  children, ...props
}: PropsWithChildren<ButtonHTMLAttributes<any>>) => {
  const { className, ...restProps } = props;

  return (
    <button
      className={cx(
        'bg-gradient-to-r from-orange-500 via-red-600 to-fuchsia-600 inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]',
        className,
      )}
      type="button"
      data-te-ripple-init
      data-te-ripple-color="light"
      {...restProps}
    >
      {children}
    </button>
  );
};
