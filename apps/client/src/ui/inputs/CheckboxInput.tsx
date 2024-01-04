import {
  forwardRef,
  Ref,
  InputHTMLAttributes,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { ErrorIcon } from '@/ui/errors/ErrorIcon';

type Props = {
  errors?: (string | boolean | undefined)[];
  defaultChecked?: boolean;
} & InputHTMLAttributes<any>;

export const CheckboxInput = forwardRef((props: PropsWithChildren<Props>, ref: Ref<any>) => {
  const { defaultChecked, children, onChange, ...restProps } = props;
  const errors = Array.isArray(props.errors) ? props.errors.filter(Boolean) : [];
  const [checked, setChecked] = useState<boolean>(defaultChecked ?? false);

  useEffect(() => {
    const event = {
      target: { name: props.name, value: checked },
    };
    onChange && onChange(event as any);
  }, [checked]);

  return (
    <>
      <label
        className="flex cursor-pointer select-none text-sm font-medium text-body-color"
        onClick={() => setChecked(!checked)}
      >
        <input ref={ref} type="checkbox" className="w-10 h-10"{...restProps} />
        <div className="px-3">{children}</div>
      </label>

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
