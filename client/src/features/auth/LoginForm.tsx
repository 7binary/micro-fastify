import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { authHttp, networkErrorHandler } from '@/network';
import { useActions } from '@/store';
import { TextInput } from '@/ui/inputs/TextInput';
import { Button } from '@/ui/buttons/Button';
import { ErrorMessage } from '@/ui/errors/ErrorMessage';
import { AuthGoogleButton } from '@/features/auth/AuthGoogleButton';
import { AuthBox } from '@/features/auth/AuthBox';

export const LoginForm = () => {
  const { setAuthResponse } = useActions();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{email: string, password: string}>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const submit = handleSubmit(async (data) => {
    try {
      const authResponse = await authHttp.login(data);
      setAuthResponse(authResponse);
    } catch (err: any) {
      setErrorMessage(networkErrorHandler(err, setError));
    }
  });

  return (
    <AuthBox title="Sign in to your account" subtitle="Login to your account for a faster checkout">
      <AuthGoogleButton text="Sign in with Google" />
      <div className="mb-8 flex items-center justify-center">
        <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color sm:block"></span>
        <p className="w-full px-5 text-center text-base font-medium text-body-color">
          Or, sign in with your email
        </p>
        <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color sm:block"></span>
      </div>
      <form onSubmit={submit}>
        <div className="mb-2">
          <TextInput
            {...register('email', { required: 'required' })}
            label="Your Email"
            placeholder="Enter your Email"
            errors={[errors.email?.message]}
          />
        </div>
        <div className="mb-2">
          <TextInput
            {...register('password', { required: 'required' })}
            label="Your Password"
            placeholder="Enter your Password"
            type="password"
            errors={[errors.password?.message]}
          />
        </div>
        <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
          <div className="mb-4 sm:mb-0">
            <label
              htmlFor="checkboxLabel"
              className="flex cursor-pointer select-none items-center text-sm font-medium text-body-color"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  id="checkboxLabel"
                  className="sr-only"
                />
                <div className="box mr-4 flex h-5 w-5 items-center justify-center rounded border border-body-color border-opacity-20 dark:border-white dark:border-opacity-10">
                  <div className="opacity-0">
                    <svg
                      width="11"
                      height="8"
                      viewBox="0 0 11 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                        fill="#3056D3"
                        stroke="#3056D3"
                        strokeWidth="0.4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              Keep me signed in
            </label>
          </div>
          <div>
            <a
              href="#0"
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </div>
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <div className="mb-6">
          <Button block type="submit" onClick={submit} loading={isSubmitting}>
            Sign in
          </Button>
        </div>
      </form>
      <p className="text-center text-base font-medium text-body-color">
        Don’t you have an account?
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </AuthBox>
  );
};
