import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import cx from 'classnames';
import { ButtonLoadingIcon } from './ButtonLoadingIcon';

interface Props {
  loading?: boolean;
  block?: boolean;
  outlined?: boolean;
  text?: boolean;
}

export const Button = ({
  children, ...props
}: PropsWithChildren<ButtonHTMLAttributes<any> & Props>) => {
  const { className, loading, block, outlined, text, ...restProps } = props;

  if (loading) {
    restProps.disabled = true;
  }

  return (
    <button
      className={cx(
        block && 'w-full',
        outlined && 'bg-transparent border border-primary',
        text && 'bg-transparent text-black dark:text-white',
        !text && 'text-white',
        'flex items-center justify-center rounded-md bg-primary py-2 px-9 text-base font-medium transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-auth',
        className,
      )}
      type="button"
      {...restProps}
    >
      {loading && <ButtonLoadingIcon />}
      {children}
    </button>
  );
};
