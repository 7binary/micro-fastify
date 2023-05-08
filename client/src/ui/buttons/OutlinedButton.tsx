import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import cx from 'classnames';
import { ButtonLoadingIcon } from './ButtonLoadingIcon';

interface Props {
  loading?: boolean;
}

export const OutlinedButton = ({
  children, ...props
}: PropsWithChildren<ButtonHTMLAttributes<any> & Props>) => {
  const { className, loading, ...restProps } = props;

  if (loading) {
    restProps.disabled = true;
  }

  return (
    <button
      className={cx(
        'inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 disabled:opacity-80 disabled:cursor-not-allowed dark:hover:bg-neutral-100 dark:hover:bg-opacity-10',
        className,
      )}
      type="button"
      data-te-ripple-init
      data-te-ripple-color="light"
      {...restProps}
    >
      {loading && <ButtonLoadingIcon />}
      {children}
    </button>
  );
};
