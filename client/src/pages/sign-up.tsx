import { RegisterForm } from '@/features/auth/RegisterForm';
import { GuestLayout } from '@/layouts/GuestLayout';
import Head from 'next/head';

const SignUpPage = () => {
  return (
    <>
      <Head>
        <title>Sign up | MicroFastify</title>
      </Head>
      <GuestLayout title="Sign up right now!">
        <RegisterForm />
      </GuestLayout>
    </>
  );
};

export default SignUpPage;
