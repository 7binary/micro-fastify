import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useActions } from '@/store';
import { authHttp, networkErrorHandler } from '@/network';
import { TextInput } from '@/ui/inputs/TextInput';
import { PrimaryButton } from '@/ui/buttons/PrimaryButton';
import { OutlinedButton } from '@/ui/buttons/OutlinedButton';
import { ErrorMessage } from '@/ui/errors/ErrorMessage';

export const RegisterForm = () => {
  const router = useRouter();
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
      const authResponse = await authHttp.register(data);
      await setAuthResponse(authResponse);
      await router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(networkErrorHandler(err, setError));
    }
  });

  return (
    <form onSubmit={submit}>
      <div>
        <TextInput
          {...register('email', { required: 'required' })}
          label="E-mail"
          errors={[errors.email?.message]}
        />
      </div>
      <div className="mt-2">
        <TextInput
          {...register('password', { required: 'required' })}
          label="Password"
          type="password"
          errors={[errors.password?.message]}
        />
      </div>
      <ErrorMessage>{errorMessage}</ErrorMessage>
      <div className="mt-4 text-center">
        <PrimaryButton className="w-full" type="submit" onClick={submit} disabled={isSubmitting}>
          Sign up
        </PrimaryButton>
        <a href="#" className="mt-2 inline-block">Forgot password?</a>
      </div>
      <div className="mt-12 flex items-center justify-between pb-6">
        <p className="mb-0 mr-2">Already have an account?</p>
        <Link href="/" passHref>
          <OutlinedButton>Sign in</OutlinedButton>
        </Link>
      </div>
    </form>
  );
};
