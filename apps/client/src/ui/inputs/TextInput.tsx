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

  const Input = (
    <input
      className={cx(
        'w-full rounded-md border border-transparent py-2 px-6 text-base text-body-color placeholder-body-color shadow-one focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] className="dark:shadow-dark',
        className,
        errors.length > 0 && 'border-red-500 focus:ring-red-500',
      )}
      {...restProps}
      ref={ref}
    />
  );

  return (
    <>
      {label === undefined ? (Input) : (
        <label
          htmlFor="email"
          className="mb-3 block text-sm font-medium text-dark dark:text-white"
        >
          <div className="mb-2">{label}</div>
          {Input}
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

      {errors.length === 0 && (
        <div className="flex invisible text-xs mt-0.5 ml-1">{' '}</div>
      )}
    </>
  );
});
