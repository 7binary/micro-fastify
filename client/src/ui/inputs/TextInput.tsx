import { forwardRef, Ref, InputHTMLAttributes } from 'react';
import cx from 'classnames';
import { ErrorIcon } from '@/ui/errors/ErrorIcon';

type Props = {
  label?: string;
  errors?: (string | boolean | undefined)[];
} & InputHTMLAttributes<any>;

export const TextInput = forwardRef((props: Props, ref: Ref<any>) => {
  const { label, className, ...restProps } = props;
  const errors = Array.isArray(props.errors) ? props.errors.filter(Boolean) : [];

  return (
    <>
      {label === undefined ? (
        <input
          className={cx(
            'w-full p-2.5 rounded bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
            className,
          )}
          {...restProps}
          ref={ref}
        />
      ) : (
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          <div className="mb-1">{label}</div>
          <input
            className={cx(
              'w-full p-2.5 rounded bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
              className,
              errors.length > 0 && 'outline-red-500 border-red-500 focus:ring-red-500',
            )}
            {...restProps}
            ref={ref}
          />
        </label>
      )}
      {errors.map((error, i) => (
        <div
          key={i}
          className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-0.5 ml-1"
        >
          <ErrorIcon />
          {error}
        </div>
      ))}
      {errors.length === 0 && <div className="flex invisible text-xs mt-0.5 ml-1">&nbsp;</div>}
    </>
  );
});
