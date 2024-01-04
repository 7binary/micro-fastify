import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useState } from 'react';

import { useActions } from '@/store';
import { authHttp, networkErrorHandler } from '@/network';
import { TextInput } from '@/ui/inputs/TextInput';
import { Button } from '@/ui/buttons/Button';
import { ErrorMessage } from '@/ui/errors/ErrorMessage';
import { AuthGoogleButton } from '@/features/auth/AuthGoogleButton';
import { AuthBox } from '@/features/auth/AuthBox';
import { CheckboxInput } from '@/ui/inputs/CheckboxInput';

export const RegisterForm = () => {
  const { setAuthResponse } = useActions();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{email: string, password: string, acceptTerms: boolean}>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const submit = handleSubmit(async (data) => {
    try {
      const authResponse = await authHttp.register(data);
      await setAuthResponse(authResponse);
    } catch (err: any) {
      setErrorMessage(networkErrorHandler(err, setError));
    }
  });

  return (
    <AuthBox title="Create your account" subtitle="It’s totally free and super easy">
      <AuthGoogleButton text="Sign up with Google" />
      <div className="mb-8 flex items-center justify-center">
        <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color sm:block"></span>
        <p className="w-full px-5 text-center text-base font-medium text-body-color">
          Or, register with your email
        </p>
        <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color sm:block"></span>
      </div>
      <form onSubmit={submit}>
        <div className="mt-2">
          <TextInput
            {...register('email', { required: 'required' })}
            label="Your Email"
            placeholder="Enter your Email"
            errors={[errors.email?.message]}
          />
        </div>
        <div className="mt-2">
          <TextInput
            {...register('password', { required: 'required' })}
            label="Your Password"
            placeholder="Enter your Password"
            type="password"
            errors={[errors.password?.message]}
          />
        </div>
        <div className="mt-2">
          <CheckboxInput
            {...register('acceptTerms', { required: 'required' })}
            errors={[errors.acceptTerms?.message]}
          >
            By creating account means you agree to the
            <a href="#0" className="text-primary hover:underline">
              {' '}Terms and Conditions{' '}
            </a>
            , and our
            <a href="#0" className="text-primary hover:underline">
              {' '}Privacy Policy{' '}
            </a>
          </CheckboxInput>
        </div>
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <div className="mt-6">
          <Button block type="submit" onClick={submit} loading={isSubmitting}>
            Sign up
          </Button>
        </div>
      </form>
      <p className="text-center text-base font-medium text-body-color mt-2">
        Already using MicroFastify?{' '}
        <Link href="/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthBox>
  );
};
