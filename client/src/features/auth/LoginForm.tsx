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
